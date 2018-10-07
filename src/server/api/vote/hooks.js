import { Op } from "sequelize";
import WebSocket from "ws";
import Vote from "./model";
import emit from "../../emit";
import wss from "../../wss";

// eslint-disable-next-line import/prefer-default-export
export const updateClientsVotes = (vote, hook) => {
  const where =
    hook === "beforeDestroy"
      ? { postId: vote.postId, socketId: { [Op.ne]: vote.socketId } }
      : { postId: vote.postId };

  Vote.sum("vote", { where }).then(upvotes => {
    const data = emit("updatePost", {
      id: vote.postId,
      modPost: {
        upvotes: upvotes || 0
      }
    });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.id) {
        client.send(data);
      }
    });
  });
};

Vote.addHook("beforeUpsert", "updateClientsVotes", (vote, options) =>
  updateClientsVotes(vote, "beforeUpsert", options)
);
Vote.addHook("beforeDestroy", "updateClientsVotes", (vote, options) =>
  updateClientsVotes(vote, "beforeDestroy", options)
);
