import nanoid from "nanoid";
import Sequelize from "sequelize";
import sequelize from "../../sequelize";
import Post from "../post/model";
import Connection from "../connection/model";

const Lobby = sequelize.define("lobby", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: () => nanoid()
  },
  prompt: {
    type: Sequelize.STRING
  },
  inGame: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  nextRoundAt: {
    type: Sequelize.DATE
  },
  roundTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 60
  }
});

Lobby.hasMany(Post, { onDelete: "CASCADE" });
Lobby.hasMany(Connection, { onDelete: "CASCADE" });
Lobby.belongsTo(Connection, {
  foreignKey: "hostSocketId",
  constraints: false
});

export default Lobby;
