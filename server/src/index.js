import Player from "./api/player/model";
import Lobby from "./api/lobby/model";
import handlers from "./api";
import sequelize from "./sequelize";
import wss from "./wss";

sequelize
  .sync()
  .then(() =>
    Lobby.create({
      inGame: true,
      prompt: "What's up doc"
    })
  )
  .then(lobby => {
    global.mainLobby = lobby;
  });

wss.on("connection", ws => {
  ws.on("message", handlers);

  // eslint-disable-next-line func-names
  ws.on("close", function() {
    if (!this.id) {
      return;
    }
    Player.findById(this.id).then(player => {
      player.destroy();
    });
  });
});

const port = process.env.PORT;

// eslint-disable-next-line no-console
console.log(`Started using port: ${port}`);
