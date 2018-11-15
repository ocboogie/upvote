import Player from "./api/player/model"
import Lobby from "./api/lobby/model"
import handlers from "./api"
import sequelize from "./sequelize"
import wss from "./wss"

global.lobbyIdLength = 10

sequelize
  .sync()
  .then(() =>
    Lobby.create({
      inGame: true,
      prompt: "What's up doc"
    })
  )
  .then(lobby => {
    global.mainLobbyId = lobby.id
  })

wss.on("connection", ws => {
  ws.on("message", handlers)

  ws.isAlive = true

  // eslint-disable-next-line func-names
  ws.on("pong", function() {
    this.isAlive = true
  })
  // eslint-disable-next-line func-names
  ws.on("close", function() {
    if (!this.id) {
      return
    }
    Player.destroy({ where: { id: this.id }, individualHooks: true })
  })
})

function noop() {}

setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) {
      ws.terminate()
      return
    }

    ws.isAlive = false
    ws.ping(noop)
  })
}, 30000)

const port = process.env.PORT

// eslint-disable-next-line no-console
console.log(`Started using port: ${port}`)
