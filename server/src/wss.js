import dotenv from "dotenv";
import WebSocket from "ws";

dotenv.config();

const port = process.env.API_PORT;

export default new WebSocket.Server({
  port
});
