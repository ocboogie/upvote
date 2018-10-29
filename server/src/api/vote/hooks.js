import { Op } from "sequelize";
import Vote from "./model";
import { broadcast } from "../../wss";

// eslint-disable-next-line import/prefer-default-export
export const updateClientsVotes = async (vote, hook) => {
  let upvotes =
    (await Vote.sum("vote", {
      where: { postId: vote.postId, socketId: { [Op.ne]: vote.socketId } }
    })) || 0;

  if (hook === "beforeUpsert") {
    upvotes += vote.vote;
  }

  broadcast("updatePost", {
    id: vote.postId,
    modPost: {
      upvotes
    }
  });
};

Vote.addHook("beforeUpsert", "updateClientsVotes", (vote, options) =>
  updateClientsVotes(vote, "beforeUpsert", options)
);
Vote.addHook("beforeDestroy", "updateClientsVotes", (vote, options) =>
  updateClientsVotes(vote, "beforeDestroy", options)
);
