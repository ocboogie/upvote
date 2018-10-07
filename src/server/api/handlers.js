import "./connection/methods";
import "./connection/hooks";
import "./vote/hooks";
import connectionHandlers from "./connection/handlers";
import postHandlers from "./post/handlers";
import voteHandlers from "./vote/handlers";

const handlers = {
  ...connectionHandlers,
  ...postHandlers,
  ...voteHandlers
};

export default function(dataString) {
  const { data, type } = JSON.parse(dataString);
  const wsEvent = handlers[type];

  if (!wsEvent) {
    // eslint-disable-next-line no-throw-literal
    throw `No event named: ${type}`;
  }
  wsEvent.bind(this)(data);
}
