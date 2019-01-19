import Lobby, { LobbyId } from "./api/lobby/model"
import Post, { PostForClient, PostId } from "./api/post/model"
import { PlayerForClient } from "./api/player/model"

type PlayerId = PlayerForClient["id"]

declare global {
  namespace NodeJS {
    interface Global {
      mainLobbyId: LobbyId
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
      lobbyId: LobbyId
    }
    createdLobby: {
      player: PlayerForClient
      lobbyId: LobbyId
    }
    leftLobby: undefined
    hostDisconnected: undefined
    newPost: PostForClient
    updatePosts: Partial<PostForClient>[]
    updatePost: {
      id: PostId
      modPost: Partial<PostForClient>
    }
    removePosts: PostId[]
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
