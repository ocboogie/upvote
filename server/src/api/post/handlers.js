import Post from "./model";
import Player from "../player/model";
import { broadcast } from "../../wss";

export default {
  async post(content) {
    if (!this.id) {
      return;
    }

    const post = await Post.create({ authorSocketId: this.id, content });
    global.mainLobby.addPost(post);

    const { name } = await Player.findById(this.id);

    broadcast("newPost", {
      content: post.content,
      createdAt: post.createdAt,
      id: post.id,
      author: name,
      upvotes: 0
    });
  }
};
