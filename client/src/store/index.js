import Vue from "vue"
import Vuex from "vuex"
import ws, { emit } from "../socket"
import lobby from "./modules/lobby"
import modal from "./modules/modal"
import player from "./modules/player"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    lobby,
    modal,
    player
  },
  actions: {
    createLobby(context, name) {
      emit("createLobby", name)
    },
    joinLobby(context, name) {
      emit("joinLobby", {
        name, // If empty string use undefined
        lobbyId: window.location.search.slice(1) || undefined
      })
    },
    startGame(context, payload) {
      emit("startGame", payload)
    },
    reset(context) {
      context.commit("setStage", "connected")
      context.commit("clearPosts")
      context.commit("clearPlayers")
      context.commit("setHosting", false)
      context.commit("setLobbyId", null)
      context.commit("setWinners", null)
    },
    connectionClosed(context) {
      context.dispatch("reset")
      context.dispatch("openModal", "disconnected")
    },
    connectedToALobby(context, { playerId, players }) {
      context.commit("setPlayerId", playerId)
      context.commit("addPlayers", players)
    },

    gameStartedWs(context, payload) {
      context.commit("setPrompt", payload.prompt)
      context.commit(
        "setRoundEndAt",
        new Date(Date.now() + payload.timeTillRoundEnd)
      )
      context.commit("setStage", "inGame")
      context.commit("clearPosts")
      context.commit("setWinners", null)
    },
    joinedGameWs(context, payload) {
      context.dispatch("connectedToALobby", {
        playerId: payload.playerId,
        players: payload.players
      })
      context.commit("setPrompt", payload.prompt)
      context.commit(
        "setRoundEndAt",
        new Date(Date.now() + payload.timeTillRoundEnd)
      )
      context.commit("setStage", "inGame")
      context.commit(
        "setPosts",
        payload.posts.reduce((posts, post) => {
          posts[post.id] = post
          return posts
        }, {})
      )
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    joinedLobbyWs(context, payload) {
      context.dispatch("connectedToALobby", {
        playerId: payload.playerId,
        players: payload.players
      })
      context.commit("setStage", "inLobby")
      context.commit("setLobbyId", payload.lobbyId)
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    createdLobbyWs(context, { lobbyId, player: me }) {
      context.dispatch("connectedToALobby", {
        playerId: me.id,
        players: [me]
      })
      context.commit("setStage", "inLobby")
      context.commit("setLobbyId", lobbyId)
      context.commit("setHosting", true)
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    leftLobbyWs(context) {
      context.dispatch("reset")
    },
    hostDisconnectedWs(context) {
      emit("leaveLobby")
      context.dispatch("openModal", "hostDisconnected")
    },
    roundEndedWs(context, winners) {
      context.commit("setWinners", winners)
    },
    waitingForGameToFinishWs(context, { players, playerId }) {
      context.dispatch("connectedToALobby", { playerId, players })
      context.commit("setStage", "waitingForGameToFinish")
    }
  }
})

ws.onopen = () => {
  store.dispatch("connected")
}

ws.onclose = () => {
  store.dispatch("connectionClosed")
}

ws.onmessage = ({ data: wsData }) => {
  const data = JSON.parse(wsData)
  store.dispatch(`${data.type}Ws`, data.payload)
}

export default store
