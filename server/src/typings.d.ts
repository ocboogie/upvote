import Lobby from "./api/lobby/model"
import Post, { PostForClient } from "./api/post/model"

declare global {
  namespace NodeJS {
    interface Global {
      mainLobbyId: string
    }
  }

  type ClientEvents = {
    gameStarted: {
      prompt: string
      roundEndAt: Date
    }
    joinedGame: {
      posts: PostForClient[]
      players: string[]
      prompt: string
      roundEndAt: Date
    }
    joinedLobby: {
      players: string[]
      lobbyId: string
    }
    createdLobby: string
    leftLobby: undefined
    hostDisconnected: undefined
    newPost: PostForClient
    updatePosts: Partial<PostForClient>[]
    updatePost: {
      id: number
      modPost: Partial<PostForClient>
    }
    removePosts: number[]
    newPlayer: string
    removePlayer: string
    existingPlayer: undefined
    alreadyInALobby: undefined
    lobbyNotFound: undefined
    roundEnded: string[]
    waitingForGameToFinish: string[]
  }

  type ClientEventNames = keyof ClientEvents
}
