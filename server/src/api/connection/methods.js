import uuid from "uuid/v4";
import { Op, literal } from "sequelize";
import Connection from "./model";
import Post from "../post/model";
import { broadcast, emit } from "../../wss";
import Vote from "../vote/model";

Connection.login = async (socket, name) => {
  if (socket.id) {
    emit(socket, "alreadyInALobby");
    return;
  }

  const existingConnection = await Connection.findOne({
    where: {
      name
    }
  });
  if (existingConnection !== null) {
    emit(socket, "existingUser");
    return;
  }

  // eslint-disable-next-line no-param-reassign
  socket.id = uuid();

  const connection = await Connection.create({
    socketId: socket.id,
    name
  });

  // eslint-disable-next-line consistent-return
  return connection;
};

Connection.sendRemovePostsToClients = async disconnectedSocketId => {
  const posts = await Post.findAll({
    where: { authorSocketId: disconnectedSocketId }
  });

  if (!posts.length) {
    return;
  }

  broadcast("removePosts", posts.map(post => post.id));
};

Connection.updateClientsVotes = async disconnectedSocketId =>
  (await Post.findAll({
    attributes: [
      "id",
      [
        literal(
          `(SELECT SUM("votes"."vote") FROM votes WHERE "votes"."postId"="post"."id" AND "votes"."socketId"!=$1 )`
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
          socketId: disconnectedSocketId
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

Connection.sendRemovedUserToClients = (name, excludedSocketId) =>
  broadcast("removeUser", name, client => client.id !== excludedSocketId);
Connection.sendNewUserToClients = (name, excludedSocketId) =>
  broadcast("newUser", name, client => client.id !== excludedSocketId);
