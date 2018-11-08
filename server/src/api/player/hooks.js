import WebSocket from "ws"
import Player from "./model"
import Lobby from "../lobby/model"
import wss, { emit } from "../../wss"

// eslint-disable-next-line import/prefer-default-export
export const updateClients = player => {
  if (player.hosting) {
    Lobby.destroy({ where: { id: player.lobbyId } })
    wss.clients.forEach(client => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.id &&
        client.lobbyId === player.lobbyId &&
        client.id !== player.id
      ) {
        /* eslint-disable no-param-reassign */
        delete client.id
        delete client.lobbyId
        /* eslint-enable no-param-reassign */
        emit(client, "hostDisconnected")
      }
    })
    return
  }

  Player.sendRemovedPlayerToClients(player.name, player.lobbyId, player.id)
  // eslint-disable-next-line consistent-return
  return Promise.all([
    Player.sendRemovePostsToClients(player.id, player.lobbyId),
    Player.updateClientsVotes(player.id, player.lobbyId)
  ])
}

Player.addHook("beforeDestroy", "updateClients", updateClients)
Player.addHook("afterCreate", "updateClients", ({ name, lobbyId, id }) =>
  Player.sendNewPlayerToClients(name, lobbyId, id)
)
