import { Op } from "sequelize";
import WebSocket from "ws";
import Vote from "./model";
import emit from "../../emit";
import wss from "../../wss";

// eslint-disable-next-line import/prefer-default-export
export const updateClientsVotes = async (vote, hook) => {
  let upvotes =
    (await Vote.sum("vote", {
      where: { postId: vote.postId, socketId: { [Op.ne]: vote.socketId } }
    })) || 0;

  if (hook === "beforeUpsert") {
    upvotes += vote.vote;
  }

  const message = emit("updatePost", {
    id: vote.postId,
    modPost: {
      upvotes
    }
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.id) {
      client.send(message);
    }
  });
};

Vote.addHook("beforeUpsert", "updateClientsVotes", (vote, options) =>
  updateClientsVotes(vote, "beforeUpsert", options)
);
Vote.addHook("beforeDestroy", "updateClientsVotes", (vote, options) =>
  updateClientsVotes(vote, "beforeDestroy", options)
);
