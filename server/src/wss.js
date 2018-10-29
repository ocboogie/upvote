import dotenv from "dotenv";
import WebSocket from "ws";

dotenv.config();

const port = process.env.PORT;

const wss = new WebSocket.Server({
  port
});

export const messageCreator = (type, payload) =>
  JSON.stringify({ type, payload });

export const emit = (who, type, payload) =>
  who.send(messageCreator(type, payload));

export const broadcast = (type, payload, filter) =>
  wss.clients.forEach(client => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.id &&
      (!filter || filter(client))
    ) {
      client.send(messageCreator(type, payload));
    }
  });

export default wss;
