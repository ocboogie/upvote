import Post from "./model"
import Player from "../player/model"
import { broadcast } from "../../wss"

export default {
  async post(content) {
    if (!this.id) {
      return
    }

    const lobbyId = this.lobbyId || global.mainLobbyId

    const post = await Post.create({
      playerId: this.id,
      content,
      lobbyId
    })

    const { name } = await Player.findByPk(this.id)

    broadcast("newPost", lobbyId, {
      content: post.content,
      createdAt: post.createdAt,
      id: post.id,
      author: name,
      upvotes: 0
    })
  }
}
