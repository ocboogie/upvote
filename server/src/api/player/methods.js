import uuid from "uuid/v4"
import { Op, literal } from "sequelize"
import Player from "./model"
import Post from "../post/model"
import { broadcast, emit } from "../../wss"
import Vote from "../vote/model"

Player.register = async (socket, name, lobbyId, hosting = false) => {
  if (socket.id) {
    emit(socket, "alreadyInALobby")
    return
  }

  const existingPlayer = await Player.findOne({
    where: {
      name,
      lobbyId
    }
  })
  if (existingPlayer !== null) {
    emit(socket, "existingPlayer")
    return
  }

  // eslint-disable-next-line no-param-reassign
  socket.id = uuid()
  // eslint-disable-next-line no-param-reassign
  socket.lobbyId = lobbyId

  const player = await Player.create({
    id: socket.id,
    lobbyId,
    name,
    hosting
  })

  // eslint-disable-next-line consistent-return
  return player
}

Player.sendRemovePostsToClients = async (disconnectedSocketId, lobbyId) => {
  const posts = await Post.findAll({
    where: { playerId: disconnectedSocketId }
  })

  if (!posts.length) {
    return
  }

  broadcast("removePosts", lobbyId, posts.map(post => post.id))
}

Player.updateClientsVotes = async (disconnectedSocketId, lobbyId) =>
  broadcast(
    "updatePosts",
    lobbyId,
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
        playerId: { [Op.ne]: disconnectedSocketId }
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
    })).reduce((posts, post) => {
      // eslint-disable-next-line no-param-reassign
      posts[post.id] = { upvotes: post.get("upvotes") || 0 }
      return posts
    }, {})
  )

Player.sendRemovedPlayerToClients = (name, lobbyId, excludedSocketId) =>
  broadcast(
    "removePlayer",
    lobbyId,
    name,
    client => client.id !== excludedSocketId
  )

Player.sendNewPlayerToClients = (name, lobbyId, excludedSocketId) =>
  broadcast(
    "newPlayer",
    lobbyId,
    name,
    client => client.id !== excludedSocketId
  )
