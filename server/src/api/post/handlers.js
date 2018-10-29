import Post from "./model";
import Connection from "../connection/model";
import { broadcast } from "../../wss";

export default {
  async post(content) {
    if (!this.id) {
      return;
    }

    const post = await Post.create({ authorSocketId: this.id, content });
    global.mainLobby.addPost(post);

    const { name } = await Connection.findById(this.id);

    broadcast("newPost", {
      content: post.content,
      createdAt: post.createdAt,
      id: post.id,
      author: name,
      upvotes: 0
    });
  }
};
