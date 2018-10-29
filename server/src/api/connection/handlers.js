import uuid from "uuid/v4";
import Connection from "./model";
import Post from "../post/model";
import Vote from "../vote/model";
import { emit } from "../../wss";

export default {
  // Make this function async
  login(name) {
    if (this.id) {
      emit(this, "alreadyLoggedIn");
      return;
    }
    Connection.findOne({
      where: {
        name
      }
    })
      .then(userWithThatName => {
        if (userWithThatName !== null) {
          emit(this, "existingUser");
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

        // TODO: Make this not look awful
        // eslint-disable-next-line consistent-return
        return Promise.all([
          Promise.all(
            posts.map(post =>
              Promise.all([
                Vote.sum("vote", { where: { postId: post.id } }),
                Connection.findOne({
                  where: { socketId: post.authorSocketId }
                })
              ]).then(([upvotes, authorConnection]) => ({
                content: post.content,
                createdAt: post.createdAt,
                id: post.id,
                author: authorConnection.name,
                upvotes: upvotes || 0
              }))
            )
          ),
          Connection.findAll({ where: {} })
        ]);
      })
      .then(([posts, connections]) => {
        emit(this, "loggedIn", {
          posts,
          userList: connections.map(connection => connection.name)
        });
      });
  },
  async signOut() {
    if (!this.id) {
      return;
    }
    const connection = await Connection.findById(this.id);
    connection.destroy();
    delete this.id;
    emit(this, "signedOut");
  }
};
