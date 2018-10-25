import uuid from "uuid/v4";
import Connection from "./model";
import Post from "../post/model";
import Vote from "../vote/model";
import emit from "../../emit";

export default {
  // Make this function async
  login(name) {
    if (this.id) {
      this.send(emit("alreadyLoggedIn"));
      return;
    }
    Connection.findOne({
      where: {
        name
      }
    })
      .then(userWithThatName => {
        if (userWithThatName !== null) {
          this.send(emit("existingUser"));
          return;
        }

        this.id = uuid();
        // eslint-disable-next-line consistent-return
        return Connection.create({
          socketId: this.id,
          name
        });
      })
      .then(connection => {
        if (!connection) {
          return;
        }

        // eslint-disable-next-line consistent-return
        return Post.findAll({ where: {} });
      })
      .then(posts => {
        if (!posts) {
          return;
        }

        // eslint-disable-next-line consistent-return
        return Promise.all(
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
      })
      .then(posts => {
        if (!posts) {
          return;
        }
        this.send(emit("loggedIn", posts));
      });
  },
  async signOut() {
    if (!this.id) {
      return;
    }
    const connection = await Connection.findById(this.id);
    connection.destroy();
    delete this.id;
    this.send(emit("signedOut"));
  }
};
