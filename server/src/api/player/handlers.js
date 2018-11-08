import sequelize from "sequelize"
import Player from "./model"
import Lobby from "../lobby/model"
import Vote from "../vote/model"
import Post from "../post/model"
import { emit } from "../../wss"

export default {
  async joinLobby({ name, lobbyId: targetLobbyId }) {
    const lobbyId = targetLobbyId || global.mainLobbyId

    const lobby = await Lobby.findByPk(lobbyId)

    if (!lobby) {
      emit(this, "lobbyNotFound")
      return
    }

    const player = await Player.register(this, name, lobbyId)
    if (!player) {
      return
    }

    if (!lobby.inGame) {
      emit(this, "joinedLobby", {
        players: (await Player.findAll({
          attributes: ["name"],
          where: { lobbyId }
        })).map(otherPlayer => otherPlayer.name),
        lobbyId
      })
      return
    }

    const [posts, players] = await Promise.all([
      Post.findAll({
        group: ["post.id"],
        attributes: [
          "content",
          "createdAt",
          "id",
          [sequelize.col("player.name"), "author"],
          [
            sequelize.fn(
              "COALESCE",
              sequelize.fn("SUM", sequelize.col("votes.vote")),
              0
            ),
            "upvotes"
          ]
        ],
        include: [
          { model: Player, attributes: [] },
          { model: Vote, attributes: [] }
        ],
        where: { lobbyId }
      }),
      Player.findAll({ attributes: ["name"], where: { lobbyId } })
    ])

    emit(this, "joinedGame", {
      posts,
      players: players.map(otherPlayer => otherPlayer.name)
    })
  },
  async leaveLobby() {
    if (!this.id) {
      return
    }

    await Player.destroy({ where: { id: this.id }, individualHooks: true })

    delete this.id
    delete this.lobbyId
    emit(this, "leftLobby")
  }
}
