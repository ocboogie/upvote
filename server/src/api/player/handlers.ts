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
      lobbyId = global.mainLobbyId
    }: {
      name: string
      lobbyId?: string
    }
  ) {
    const lobby = await Lobby.r.findOne(lobbyId)

    if (!lobby) {
      emit(this, "lobbyNotFound")
      return
    }

    const player = Player.r.create({ name, lobbyId })

    const successful = await player.register(this)
    if (!successful) {
      return
    }

    if (!lobby.inGame) {
      emit(this, "joinedLobby", {
        players: (await Player.r.find({
          lobbyId
        })).map(otherPlayer => otherPlayer.name),
        lobbyId
      })
      return
    }

    const [posts, players] = await Promise.all([
      Post.r
        .createQueryBuilder("post")
        .select("content")
        .addSelect("post.id", "id")
        .leftJoin("post.author", "author")
        .addSelect("author.name", "author")
        .leftJoin("post.votes", "votes")
        .addSelect("COALESCE(SUM(`votes`.`vote`), 0)", "upvotes")
        .where("post.lobbyId = :lobbyId", { lobbyId })
        .groupBy("post.id")
        .getRawMany(),
      Player.r
        .createQueryBuilder()
        .select("name")
        .where("lobbyId = :lobbyId", { lobbyId })
        .getRawMany()
    ])

    emit(this, "joinedGame", {
      posts,
      players: players.map(otherPlayer => otherPlayer.name)
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
