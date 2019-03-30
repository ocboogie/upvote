import WebSocket from "ws"
import Post from "./model"
import Player from "../player/model"
import { broadcast } from "../../wss"

export default {
  async post(this: WebSocket, content: string) {
    if (!this.id) {
      return
    }

    const lobbyId = this.lobbyId || global.mainLobbyId

    const post = Post.r.create({ authorId: this.id, lobbyId, content })
    await Post.r.save(post)

    broadcast("newPost", lobbyId, {
      content: post.content,
      id: post.id,
      authorId: this.id,
      upvotes: 0
    })
  }
}
