import Sequelize from "sequelize";
import sequelize from "../../sequelize";

const Player = sequelize.define("player", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: { type: Sequelize.STRING, unique: true, allowNull: false }
});

export default Player;
