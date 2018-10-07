import WebSocket from "ws";
import Post from "./model";
import Connection from "../connection/model";
import emit from "../../emit";
import wss from "../../wss";

export default {
  post(content) {
    if (!this.id) {
      return;
    }

    let post;

    Post.create({ authorSocketId: this.id, content })
      .then(foundPost => {
        post = foundPost;

        return Connection.getNameById(this.id);
      })
      .then(name => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && client.id) {
            client.send(
              emit("newPost", {
                content: post.content,
                createdAt: post.createdAt,
                id: post.id,
                author: name,
                upvotes: 0
              })
            );
          }
        });
      });
  }
};
