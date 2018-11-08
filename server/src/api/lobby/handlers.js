import nanoId from "nanoid";
import { broadcast, emit } from "../../wss";
import Player from "../player/model";
import Lobby from "./model";

export default {
  async startGame() {
    await Lobby.update({ inGame: true }, { where: { id: this.lobbyId } });
    broadcast("startedGame", this.lobbyId);
  },
  async createLobby(name) {
    const lobbyId = nanoId(global.lobbyIdLength);

    const [lobby, hostPlayer] = await Promise.all([
      Lobby.create({ inGame: false, id: lobbyId }),
      Player.register(this, name, lobbyId, true)
    ]);

    await lobby.setHost(hostPlayer);

    emit(this, "createdLobby", lobby.id);
  }
};
