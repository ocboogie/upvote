import Player from "./model"
import Lobby from "../lobby/model"

Player.addHook("afterCreate", "updateClients", ({ name, lobbyId, id }) =>
  Player.sendNewPlayerToClients(name, lobbyId, id)
)

Player.addHook("beforeDestroy", "updateClients", player => {
  if (player.hosting) {
    Lobby.destroy({ where: { id: player.lobbyId }, individualHooks: true })
    return
  }

  Player.sendRemovedPlayerToClients(player.name, player.lobbyId, player.id)
  // eslint-disable-next-line consistent-return
  return Promise.all([
    Player.sendRemovedPostsToClients(player.id, player.lobbyId),
    Player.updateClientsVotes(player.id, player.lobbyId)
  ])
})
