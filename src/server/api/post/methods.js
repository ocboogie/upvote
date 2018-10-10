import Post from "./model";
import Connection from "../connection/model";
import Vote from "../vote/model";

Post.findAllAndNormalize = async options => {
  const posts = await Post.findAll(options);
  Promise.all(
    posts.map(async post => {
      const [upvotes, authorConnection] = await Promise.all([
        Vote.sum("vote", { where: { postId: post.id } }),
        Connection.findOne({ where: { socketId: post.authorSocketId } })
      ]);

      return {
        content: post.content,
        createdAt: post.createdAt,
        id: post.id,
        author: authorConnection.name,
        upvotes: upvotes || 0
      };
    })
  );
};
