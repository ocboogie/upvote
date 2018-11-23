import WebSocket from "ws"
import Vote from "./model"

export default {
  async vote(
    this: WebSocket,
    {
      id: postId,
      vote
    }: {
      id: number
      vote: "none" | "downvote" | "upvote"
    }
  ) {
    if (!this.id) {
      return
    }

    if (vote === "none") {
      const voteToBeRemoved = await Vote.r.findOne({
        where: {
          voterId: this.id,
          postId
        }
      })
      if (!voteToBeRemoved) {
        return
      }

      voteToBeRemoved.updateClients(true)
      await Vote.r.remove(voteToBeRemoved)
      return
    }

    const newPost = Vote.r.create({
      postId,
      voterId: this.id,
      vote: vote === "downvote" ? -1 : 1
    })

    await Vote.r.save(newPost)
    newPost.updateClients()
  }
}
