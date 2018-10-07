import Sequelize from "sequelize";
import sequelize from "../../sequelize";

const Connection = sequelize.define("connection", {
  socketId: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: { type: Sequelize.STRING, unique: true, allowNull: false }
});

export default Connection;
