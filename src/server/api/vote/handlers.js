import Vote from "./model";

export default {
  async vote({ id: postId, vote }) {
    if (!this.id) {
      return;
    }
    if (vote === "none") {
      const voteInstance = await Vote.findOne({
        where: {
          postId,
          socketId: this.id
        }
      });
      voteInstance.destroy();

      return;
    }

    Vote.upsert({
      postId,
      socketId: this.id,
      vote: vote === "downvote" ? -1 : 1
    });
  }
};
