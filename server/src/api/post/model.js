import Sequelize from "sequelize"
import sequelize from "../../sequelize"
import Player from "../player/model"
import Vote from "../vote/model"

const Post = sequelize.define("post", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  content: { type: Sequelize.STRING, allowNull: false }
})

Post.belongsTo(Player, {
  onDelete: "CASCADE",
  foreignKey: "playerId"
})

Post.hasMany(Vote)

export default Post
