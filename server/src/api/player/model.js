import Sequelize from "sequelize";
import sequelize from "../../sequelize";

const Player = sequelize.define(
  "player",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    name: { type: Sequelize.STRING, allowNull: false },
    hosting: { type: Sequelize.BOOLEAN, defaultValue: false }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["name", "lobbyId"]
      }
    ]
  }
);

export default Player;
