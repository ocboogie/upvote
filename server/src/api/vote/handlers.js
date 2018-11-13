import Vote from "./model"

export default {
  async vote({ id: postId, vote }) {
    if (!this.id) {
      return
    }

    if (vote === "none") {
      await Vote.destroy({
        where: {
          postId,
          id: this.id
        },
        individualHooks: true
      })
      return
    }

    Vote.upsert({
      postId,
      id: this.id,
      vote: vote === "downvote" ? -1 : 1
    })
  }
}
