import nanoId from "nanoid"
import Lobby from "./api/lobby/model"
import Prompt from "./api/prompt/model"

export default async (): Promise<Lobby> => {
  const lobbyId = nanoId()

  const mainLobby = await Lobby.r.save(
    Lobby.r.create({
      id: lobbyId,
      stage: "waitingForPlayers"
    })
  )

  const promptTexts = ["a", "b", "c", "d"]
  const prompts = promptTexts.map(promptText =>
    Prompt.r.create({
      text: promptText,
      lobbyId
    })
  )

  await Prompt.r.save(prompts)

  return mainLobby
}
