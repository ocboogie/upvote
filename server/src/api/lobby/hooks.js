import WebSocket from "ws"
import wss, { emit } from "../../wss"
import Lobby from "./model"

Lobby.addHook("beforeDestroy", "updateClients", lobby => {
  wss.clients.forEach(client => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.id &&
      client.lobbyId === lobby.id &&
      client.id !== lobby.host
    ) {
      delete client.id
      delete client.lobbyId

      emit(client, "hostDisconnected")
    }
  })
})
