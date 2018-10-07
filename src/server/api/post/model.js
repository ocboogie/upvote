import Sequelize from "sequelize";
import sequelize from "../../sequelize";
import Connection from "../connection/model";

const Post = sequelize.define("post", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  content: { type: Sequelize.STRING, allowNull: false }
});

Post.belongsTo(Connection, {
  foreignKey: "authorSocketId",
  onDelete: "CASCADE"
});

export default Post;
