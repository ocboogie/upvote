import Player from "./model";
// import Post from "../post/model";
import Vote from "../vote/model";
import { emit } from "../../wss";

export default {
  // Make this function async
  joinGame(name) {
    Player.login(this, name)
      .then(player => {
        if (!player) {
          return;
        }

        global.mainLobby.addPlayer(player);
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
                Player.findOne({
                  where: { id: post.authorSocketId }
                })
              ]).then(([upvotes, authorPlayer]) => ({
                content: post.content,
                createdAt: post.createdAt,
                id: post.id,
                author: authorPlayer.name,
                upvotes: upvotes || 0
              }))
            )
          ),
          Player.findAll({ where: {} })
        ]);
      })
      .then(([posts, players]) => {
        emit(this, "joinedGame", {
          posts,
          playerList: players.map(player => player.name)
        });
      });
  },
  async leaveLobby() {
    if (!this.id) {
      return;
    }
    const player = await Player.findById(this.id);
    player.destroy();
    delete this.id;
    emit(this, "leftLobby");
  }
};
