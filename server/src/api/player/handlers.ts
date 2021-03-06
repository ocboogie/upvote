import WebSocket from "ws"
import Player from "./model"
import Lobby from "../lobby/model"
import Post from "../post/model"
import { emit } from "../../wss"

export default {
  async joinLobby(
    this: WebSocket,
    {
      name,
      avatar,
      lobbyId = global.mainLobbyId
    }: {
      name: string
      avatar: string
      lobbyId?: string
    }
  ) {
    const lobby = await Lobby.r.findOne({
      where: { id: lobbyId },
      relations: ["activePrompt"]
    })

    if (!lobby) {
      emit(this, "lobbyNotFound")
      return
    }

    const player = Player.r.create({ name, lobbyId, avatar })

    const successful = await player.register(this)
    if (!successful) {
      return
    }

    if (lobby.stage === "break" || lobby.stage === "lobby") {
      const players = (await Player.r.find({
        lobbyId
      })).map(otherPlayer => otherPlayer.forClient())

      if (lobby.stage === "lobby") {
        emit(this, "joinedLobby", {
          playerId: this.id,
          players,
          lobbyId
        })
      } else {
        emit(this, "waitingForGameToFinish", { players, playerId: this.id })
      }

      return
    }

    const [posts, players] = await Promise.all([
      Post.r
        .createQueryBuilder("post")
        .select("content")
        .addSelect("post.id", "id")
        .addSelect("post.authorId", "authorId")
        .leftJoin("post.votes", "votes")
        .addSelect("COALESCE(SUM(`votes`.`vote`), 0)", "upvotes")
        .where("post.lobbyId = :lobbyId", { lobbyId })
        .groupBy("post.id")
        .getRawMany(),
      Player.r
        .createQueryBuilder()
        .where("lobbyId = :lobbyId", { lobbyId })
        .getMany()
    ])

    if (lobby.stage === "waitingForPlayers") {
      await lobby.setupRound()
    }

    emit(this, "joinedGame", {
      posts,
      players: players.map(otherPlayer => otherPlayer.forClient()),
      playerId: this.id,
      prompt: lobby.activePrompt.text,
      timeTillRoundEnd: lobby.roundEndAt.getTime() - Date.now()
    })
  },

  async leaveLobby(this: WebSocket) {
    if (!this.id) {
      return
    }

    await Player.deregister(this)

    emit(this, "leftLobby")
  }
}
