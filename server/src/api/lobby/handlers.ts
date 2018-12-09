import WebSocket from "ws"
import nanoid from "nanoid"
import { broadcast, emit } from "../../wss"
import Player from "../player/model"
import Lobby from "./model"
import Prompt from "../prompt/model"

export default {
  async startGame(
    this: WebSocket,
    {
      prompts: promptsString,
      roundTime
    }: { prompts: string; roundTime: number }
  ) {
    const prompts: Prompt[] = promptsString
      .split(",")
      .map(prompt =>
        Prompt.r.create({ lobbyId: this.lobbyId, text: prompt.trim() })
      )

    await Prompt.r.save(prompts)

    const activePrompt = prompts[Math.floor(Math.random() * prompts.length)]

    const lobby = Lobby.r.create({
      id: this.lobbyId,
      stage: "game",
      activePrompt,
      roundTime
    })

    lobby.updateRoundEndAt()
    lobby.scheduleRoundEndHandler()

    Lobby.r.save(lobby)

    broadcast("gameStarted", this.lobbyId, {
      prompt: activePrompt.text,
      roundEndAt: lobby.roundEndAt
    })
  },
  async createLobby(this: WebSocket, name: string) {
    const lobbyId = nanoid()
    const lobby = await Lobby.r.save({
      stage: "lobby",
      id: lobbyId
    })

    const host = Player.r.create({ name, lobbyId, hosting: true })

    const successful = await host.register(this)
    if (!successful) {
      return
    }

    await Lobby.r.update(lobby, { hostId: this.id })
    emit(this, "createdLobby", lobbyId)
  }
}
