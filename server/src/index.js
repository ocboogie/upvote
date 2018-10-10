import Connection from "./api/connection/model";
import handlers from "./api";
import sequelize from "./sequelize";
import wss from "./wss";

sequelize.sync();

wss.on("connection", ws => {
  ws.on("message", handlers);

  // eslint-disable-next-line func-names
  ws.on("close", function() {
    if (!this.id) {
      return;
    }
    Connection.findById(this.id).then(connection => {
      connection.destroy();
    });
  });
});

const port = process.env.PORT;

// eslint-disable-next-line no-console
console.log(`Started using port: ${port}`);
