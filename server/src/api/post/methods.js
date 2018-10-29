import Post from "./model";
import Player from "../player/model";
import Vote from "../vote/model";

Post.findAllAndNormalize = async options => {
  const posts = await Post.findAll(options);
  Promise.all(
    posts.map(async post => {
      const [upvotes, authorPlayer] = await Promise.all([
        Vote.sum("vote", { where: { postId: post.id } }),
        Player.findOne({ where: { id: post.authorSocketId } })
      ]);

      return {
        content: post.content,
        createdAt: post.createdAt,
        id: post.id,
        author: authorPlayer.name,
        upvotes: upvotes || 0
      };
    })
  );
};
