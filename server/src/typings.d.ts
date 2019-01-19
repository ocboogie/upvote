import Lobby from "./api/lobby/model"
import Post, { PostForClient } from "./api/post/model"
import { PlayerForClient } from "./api/player/model"

type PlayerId = PlayerForClient["id"]

declare global {
  namespace NodeJS {
    interface Global {
      mainLobbyId: string
    }
  }

  type ClientEvents = {
    gameStarted: {
      prompt: string
      timeTillRoundEnd: number
    }
    joinedGame: {
      posts: PostForClient[]
      playerId: PlayerId
      players: PlayerForClient[]
      prompt: string
      timeTillRoundEnd: number
    }
    joinedLobby: {
      players: PlayerForClient[]
      playerId: PlayerId
      lobbyId: string
    }
    createdLobby: {
      player: PlayerForClient
      lobbyId: string
    }
    leftLobby: undefined
    hostDisconnected: undefined
    newPost: PostForClient
    updatePosts: Partial<PostForClient>[]
    updatePost: {
      id: number
      modPost: Partial<PostForClient>
    }
    removePosts: number[]
    newPlayer: PlayerForClient
    removePlayer: PlayerId
    existingPlayer: undefined
    alreadyInALobby: undefined
    lobbyNotFound: undefined
    roundEnded: PlayerId[]
    waitingForGameToFinish: {
      players: PlayerForClient[]
      playerId: PlayerId
    }
  }

  type ClientEventNames = keyof ClientEvents
}
