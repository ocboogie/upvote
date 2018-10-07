import Post from "./model";
import Connection from "../connection/model";
import Vote from "../vote/model";

Post.findAllAndNormalize = options =>
  Post.findAll(options).then(posts => {
    Promise.all(
      posts.map(post =>
        Promise.all([
          Vote.sum("vote", { where: { postId: post.id } }),
          Connection.findOne({ where: { socketId: post.authorSocketId } })
        ]).then(([upvotes, authorConnection]) => ({
          content: post.content,
          createdAt: post.createdAt,
          id: post.id,
          author: authorConnection.name,
          upvotes: upvotes || 0
        }))
      )
    );
  });
