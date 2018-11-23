import "reflect-metadata"
import nanoId from "nanoid"
import { createConnection } from "typeorm"
import Lobby from "./api/lobby/model"
import Player from "./api/player/model"
import Post from "./api/post/model"
import Vote from "./api/vote/model"
import handler from "./api"
import wss from "./wss"

createConnection({
  type: "sqlite",
  database: ":memory:",
  entities: [Lobby, Player, Post, Vote],
  synchronize: true,
  logging: true
})
  .then(connection => {
    Lobby.init(connection)
    Player.init(connection)
    Post.init(connection)
    Vote.init(connection)

    const mainLobby = Lobby.r.create({
      id: nanoId(),
      prompt: "What's up, doc?",
      inGame: true
    })

    return connection.manager.save(mainLobby)
  })
  .then(mainLobby => {
    global.mainLobbyId = mainLobby.id
  })

wss.on("connection", ws => {
  ws.isAlive = true

  ws.on("message", handler)

  ws.on("pong", () => {
    ws.isAlive = true
  })

  ws.on("close", async () => {
    if (!ws.id) {
      return
    }

    const player = await Player.r.findOne(ws.id)
    if (!player) {
      return
    }
    await Player.r.remove(player)
  })
})

function noop() {}

setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) {
      ws.terminate()
      return
    }

    ws.isAlive = false
    ws.ping(noop)
  }
}, 30000)

const port = process.env.PORT

// eslint-disable-next-line no-console
console.log(`Started using port: ${port}`)
