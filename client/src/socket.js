const ws = new WebSocket(process.env.VUE_APP_API_URI);

export function emit(type, data) {
  ws.send(JSON.stringify({ type, data }));
}

export default ws;
