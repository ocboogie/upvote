import WebSocket, { Server } from "ws"
import * as dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT || "8000"

const wss = new Server({
  port: parseInt(port, 10)
})

export const messageCreator = <T extends ClientEventNames = ClientEventNames>(
  type: T,
  payload?: ClientEvents[T]
) => JSON.stringify({ type, payload })

export const emit = <T extends ClientEventNames = ClientEventNames>(
  who: WebSocket,
  type: T,
  payload?: ClientEvents[T]
) => who.send(messageCreator(type, payload))

export const broadcast = <T extends ClientEventNames = ClientEventNames>(
  type: T,
  lobbyId: string,
  payload?: ClientEvents[T] | null,
  filter?: (cilent: WebSocket) => boolean
) => {
  for (const client of wss.clients) {
    if (
      client.readyState === WebSocket.OPEN &&
      client.id &&
      client.lobbyId === lobbyId &&
      (!filter || filter(client))
    ) {
      // Don't want to send nulls as payloads. So if it's null then it's undefined
      client.send(messageCreator(type, payload || undefined))
    }
  }
}

export default wss
