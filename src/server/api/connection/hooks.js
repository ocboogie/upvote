import { Op } from "sequelize";
import WebSocket from "ws";
import wss from "../../wss";
import emit from "../../emit";
import Connection from "./model";
import Vote from "../vote/model";
import Post from "../post/model";

// eslint-disable-next-line import/prefer-default-export
export const updateClients = connection =>
  Promise.all([
    Vote.findAll({ where: { socketId: connection.socketId } })
      .then(votes =>
        Promise.all(
          votes.map(vote =>
            Vote.sum("vote", {
              where: {
                postId: vote.postId,
                socketId: { [Op.ne]: connection.socketId }
              }
            }).then(upvotes => ({
              id: vote.postId,
              modPost: {
                upvotes: upvotes || 0
              }
            }))
          )
        )
      )
      .then(votes => {
        votes.forEach(vote => {
          const data = emit("updatePost", vote);

          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.id) {
              client.send(data);
            }
          });
        });
      }),
    Post.findAll({ where: { authorSocketId: connection.socketId } }).then(
      posts => {
        const data = emit("removePosts", posts.map(post => post.id));

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && client.id) {
            client.send(data);
          }
        });
      }
    )
  ]);

Connection.addHook("beforeDestroy", "updateClients", updateClients);
