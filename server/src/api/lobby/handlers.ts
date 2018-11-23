import WebSocket from "ws"
import nanoid from "nanoid"
import { broadcast, emit } from "../../wss"
import Player from "../player/model"
import Lobby from "./model"

export default {
  async startGame(this: WebSocket) {
    await Lobby.r.update(this.lobbyId, { inGame: true })

    broadcast("gameStarted", this.lobbyId)
  },
  async createLobby(this: WebSocket, name: string) {
    const lobbyId = nanoid()
    const lobby = await Lobby.r.save({
      inGame: false,
      id: lobbyId
    })

    const host = Player.r.create({ name, lobbyId, hosting: true })

    const successful = await host.register(this)
    if (!successful) {
      return
    }

    await Lobby.r.update(lobby, { hostId: this.id })
    emit(this, "createdLobby", lobbyId)
  }
}
