import Connection from "./model";
// import Post from "../post/model";
import Vote from "../vote/model";
import { emit } from "../../wss";

export default {
  // Make this function async
  joinGame(name) {
    Connection.login(this, name)
      .then(connection => {
        if (!connection) {
          return;
        }

        global.mainLobby.addConnection(connection);
        this.lobbyId = global.mainLobby.id;

        // eslint-disable-next-line consistent-return
        return global.mainLobby.getPosts();
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
        emit(this, "joinedGame", {
          posts,
          userList: connections.map(connection => connection.name)
        });
      });
  },
  async leaveLobby() {
    if (!this.id) {
      return;
    }
    const connection = await Connection.findById(this.id);
    connection.destroy();
    delete this.id;
    emit(this, "leftLobby");
  }
};
