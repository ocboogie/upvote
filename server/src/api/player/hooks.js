import Player from "./model";

// eslint-disable-next-line import/prefer-default-export
export const updateClients = async player => {
  Player.sendRemovedPlayerToClients(player.name, player.id);
  return Promise.all([
    Player.sendRemovePostsToClients(player.id),
    Player.updateClientsVotes(player.id)
  ]);
};

Player.addHook("beforeDestroy", "updateClients", updateClients);
Player.addHook("afterCreate", "updateClientsa", ({ name, id }) =>
  Player.sendNewPlayerToClients(name, id)
);
