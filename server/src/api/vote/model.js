import Sequelize from "sequelize"
import sequelize from "../../sequelize"
import Player from "../player/model"

const Vote = sequelize.define("vote", {
  postId: {
    type: Sequelize.UUID,
    primaryKey: true,
    onDelete: "CASCADE"
  },
  id: {
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
})

Vote.belongsTo(Player, { foreignKey: "id" })

export default Vote
