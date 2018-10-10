import WebSocket from "ws";
import Post from "./model";
import Connection from "../connection/model";
import emit from "../../emit";
import wss from "../../wss";

export default {
  async post(content) {
    if (!this.id) {
      return;
    }

    const post = await Post.create({ authorSocketId: this.id, content });
    const { name } = await Connection.findById(this.id);

    const message = emit("newPost", {
      content: post.content,
      createdAt: post.createdAt,
      id: post.id,
      author: name,
      upvotes: 0
    });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.id) {
        client.send(message);
      }
    });
  }
};