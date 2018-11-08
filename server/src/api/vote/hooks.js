import { Op } from "sequelize";
import Vote from "./model";
import Player from "../player/model";
import { broadcast } from "../../wss";

// eslint-disable-next-line import/prefer-default-export
export const updateClientsVotes = async (vote, hook) => {
  const data = await Promise.all([
    Vote.sum("vote", {
      where: { postId: vote.postId, id: { [Op.ne]: vote.id } }
    }),
    Player.findOne({ attributes: ["lobbyId"], where: { id: vote.id } })
  ]);

  let upvotes = data[0] || 0;
  const voter = data[1];

  if (hook === "beforeUpsert") {
    upvotes += vote.vote;
  }

  broadcast("updatePost", voter.lobbyId, {
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
