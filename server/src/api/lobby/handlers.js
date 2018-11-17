import nanoid from "nanoid"
import uuid from "uuid/v4"
import { broadcast, emit } from "../../wss"
import Player from "../player/model"
import Lobby from "./model"

export default {
  async startGame() {
    await Lobby.update({ inGame: true }, { where: { id: this.lobbyId } })
    broadcast("gameStarted", this.lobbyId)
  },
  async createLobby(name) {
    const lobbyId = nanoid(global.lobbyIdLength)
    const playerId = uuid()

    const [lobby] = await Promise.all([
      Lobby.create({ inGame: false, id: lobbyId, hostId: playerId }),
      Player.register(this, name, lobbyId, { hosting: true, playerId })
    ])

    emit(this, "createdLobby", lobby.id)
  }
}
