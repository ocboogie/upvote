import Sequelize from "sequelize";
import sequelize from "../../sequelize";
import Connection from "../connection/model";

const Vote = sequelize.define("vote", {
  postId: {
    type: Sequelize.UUID,
    primaryKey: true,
    onDelete: "CASCADE"
  },
  socketId: {
    type: Sequelize.UUID,
    primaryKey: true,
    onDelete: "CASCADE"
  },
  vote: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[-1, 1]]
    }
  }
});

Vote.belongsTo(Connection, { foreignKey: "socketId" });

export default Vote;
