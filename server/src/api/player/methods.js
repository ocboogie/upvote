import uuid from "uuid/v4";
import { Op, literal } from "sequelize";
import Player from "./model";
import Post from "../post/model";
import { broadcast, emit } from "../../wss";
import Vote from "../vote/model";

Player.login = async (socket, name) => {
  if (socket.id) {
    emit(socket, "alreadyInALobby");
    return;
  }

  const existingPlayer = await Player.findOne({
    where: {
      name
    }
  });
  if (existingPlayer !== null) {
    emit(socket, "existingPlayer");
    return;
  }

  // eslint-disable-next-line no-param-reassign
  socket.id = uuid();

  const player = await Player.create({
    id: socket.id,
    name
  });

  // eslint-disable-next-line consistent-return
  return player;
};

Player.sendRemovePostsToClients = async disconnectedSocketId => {
  const posts = await Post.findAll({
    where: { authorSocketId: disconnectedSocketId }
  });

  if (!posts.length) {
    return;
  }

  broadcast("removePosts", posts.map(post => post.id));
};

Player.updateClientsVotes = async disconnectedSocketId =>
  (await Post.findAll({
    attributes: [
      "id",
      [
        literal(
          `(SELECT SUM("votes"."vote") FROM votes WHERE "votes"."postId"="post"."id" AND "votes"."id"!=$1 )`
        ),
        "upvotes"
      ]
    ],
    bind: [disconnectedSocketId],
    where: {
      authorSocketId: { [Op.ne]: disconnectedSocketId }
    },
    include: [
      {
        model: Vote,
        required: true,
        where: {
          id: disconnectedSocketId
        }
      }
    ]
  })).forEach(post => {
    broadcast("updatePost", {
      id: post.id,
      modPost: {
        upvotes: post.get("upvotes") || 0
      }
    });
  });

Player.sendRemovedPlayerToClients = (name, excludedSocketId) =>
  broadcast("removePlayer", name, client => client.id !== excludedSocketId);
Player.sendNewPlayerToClients = (name, excludedSocketId) =>
  broadcast("newPlayer", name, client => client.id !== excludedSocketId);
