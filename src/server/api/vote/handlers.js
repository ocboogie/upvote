import Vote from "./model";

export default {
  vote({ id: postId, vote }) {
    if (!this.id) {
      return;
    }
    if (vote === "none") {
      Vote.findOne({
        where: {
          postId,
          socketId: this.id
        }
      }).then(voteInstance => {
        voteInstance.destroy();
      });
      return;
    }
    Vote.upsert({
      postId,
      socketId: this.id,
      vote: vote === "downvote" ? -1 : 1
    });
  }
};
