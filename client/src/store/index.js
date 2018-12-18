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
      context.commit("setName", name)
      context.commit("addPlayer", name)
      emit("createLobby", name)
    },
    joinLobby(context, name) {
      context.commit("setName", name)
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
      context.commit("setPlayers", payload.players)
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    joinedLobbyWs(context, payload) {
      context.commit("setStage", "inLobby")
      context.commit("setLobbyId", payload.lobbyId)
      context.commit("setPlayers", payload.players)
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    createdLobbyWs(context, lobbyId) {
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
      context.dispatch("reset")
      context.dispatch("openModal", "hostDisconnected")
    },
    roundEndedWs(context, winners) {
      context.commit("setWinners", winners)
    },
    waitingForGameToFinishWs(context, players) {
      context.commit("setStage", "waitingForGameToFinish")
      context.commit("setPlayers", players)
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
