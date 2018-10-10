import Connection from "./model";

// eslint-disable-next-line import/prefer-default-export
export const updateClients = async connection =>
  Promise.all([
    Connection.sendRemovePostsToClients(connection.socketId),
    Connection.updateClientsVotes(connection.socketId)
  ]);

Connection.addHook("beforeDestroy", "updateClients", updateClients);
