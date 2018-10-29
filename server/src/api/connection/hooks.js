import Connection from "./model";

// eslint-disable-next-line import/prefer-default-export
export const updateClients = async connection => {
  Connection.sendRemovedUserToClients(connection.name, connection.socketId);
  return Promise.all([
    Connection.sendRemovePostsToClients(connection.socketId),
    Connection.updateClientsVotes(connection.socketId)
  ]);
};

Connection.addHook("beforeDestroy", "updateClients", updateClients);
Connection.addHook("afterCreate", "updateClientsa", ({ name, socketId }) =>
  Connection.sendNewUserToClients(name, socketId)
);
