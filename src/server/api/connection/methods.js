import { Op, literal } from "sequelize";
import WebSocket from "ws";
import Connection from "./model";
import Post from "../post/model";
import wss from "../../wss";
import emit from "../../emit";
import Vote from "../vote/model";

Connection.sendRemovePostsToClients = async disconnectedSocketId => {
  const posts = await Post.findAll({
    where: { authorSocketId: disconnectedSocketId }
  });

  if (!posts.length) {
    return;
  }

  const data = emit("removePosts", posts.map(post => post.id));

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.id) {
      client.send(data);
    }
  });
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
    const message = emit("updatePost", {
      id: post.id,
      modPost: {
        upvotes: post.get("upvotes") || 0
      }
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.id) {
        client.send(message);
      }
    });
  });
