import dotenv from "dotenv";
import WebSocket from "ws";

dotenv.config();

const port = process.env.PORT;

export default new WebSocket.Server({
  port
});
