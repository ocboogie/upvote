import WebSocket from "ws"
import lobbyHandlers from "./lobby/handlers"
import playerHandlers from "./player/handlers"
import postHandlers from "./post/handlers"
import voteHandlers from "./vote/handlers"

export const handlers = {
  ...lobbyHandlers,
  ...playerHandlers,
  ...postHandlers,
  ...voteHandlers
}

export default function(this: WebSocket, payloadString: string) {
  const { data, type }: { type: keyof typeof handlers; data: any } = JSON.parse(
    payloadString
  )
  const handler = handlers[type]

  if (!handler) {
    // eslint-disable-next-line no-throw-literal
    throw `No event named: ${type}`
  }
  handler.bind(this)(data)
}
