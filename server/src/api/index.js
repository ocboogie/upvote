import "./lobby/hooks"
import "./player/methods"
import "./player/hooks"
import "./vote/hooks"
import lobbyHandlers from "./lobby/handlers"
import playerHandlers from "./player/handlers"
import postHandlers from "./post/handlers"
import voteHandlers from "./vote/handlers"

const handlers = {
  ...lobbyHandlers,
  ...playerHandlers,
  ...postHandlers,
  ...voteHandlers
}

export default function(dataString) {
  const { data, type } = JSON.parse(dataString)
  const wsEvent = handlers[type]

  if (!wsEvent) {
    // eslint-disable-next-line no-throw-literal
    throw `No event named: ${type}`
  }
  wsEvent.bind(this)(data)
}
