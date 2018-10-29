import { Op, literal } from "sequelize";
import Connection from "./model";
import Post from "../post/model";
import { broadcast } from "../../wss";
import Vote from "../vote/model";

Connection.sendRemovePostsToClients = async disconnectedSocketId => {
  const posts = await Post.findAll({
    where: { authorSocketId: disconnectedSocketId }
  });

  if (!posts.length) {
    return;
  }

  broadcast("removePosts", posts.map(post => post.id));
};

Connection.updateClientsVotes = async disconnectedSocketId =>
  (await Post.findAll({
    attributes: [
      "id",
      [
        literal(
          `(SELECT SUM("votes"."vote") FROM votes WHERE "votes"."postId"="post"."id" AND "votes"."socketId"!=$1 )`
        ),
        "upvotes"
      ]
    ],
    bind: [disconnectedSocketId],
    where: {
      authorSocketId: { [Op.ne]: disconnectedSocketId }
    },
    include: [
      {
        model: Vote,
        required: true,
        where: {
          socketId: disconnectedSocketId
        }
      }
    ]
  })).forEach(post => {
    broadcast("updatePost", {
      id: post.id,
      modPost: {
        upvotes: post.get("upvotes") || 0
      }
    });
  });
