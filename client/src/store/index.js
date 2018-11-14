import Vue from "vue"
import Vuex from "vuex"
import ws, { emit } from "../socket"
import lobby from "./modules/lobby"
// import modal from "./modules/modal"
import player from "./modules/player"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    lobby,
    // modal,
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
      emit("joinLobby", { name, lobbyId: window.location.search.slice(1) })
    },
    startGame() {
      emit("startGame")
    },
    reset(context) {
      context.commit("setStage", "connected")
      context.commit("clearPosts")
      context.commit("clearPlayers")
      context.commit("setIsHost", false)
      context.commit("setLobbyId", null)
    },

    startedGameEvent(context) {
      context.commit("setStage", "inGame")
    },
    joinedGameEvent(context, payload) {
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
    joinedLobbyEvent(context, payload) {
      context.commit("setStage", "inLobby")
      context.commit("setLobbyId", payload.lobbyId)
      context.commit("setPlayers", payload.players)
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    createdLobbyEvent(context, lobbyId) {
      context.commit("setStage", "inLobby")
      context.commit("setLobbyId", lobbyId)
      context.commit("setIsHost", true)
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    leftLobbyEvent(context) {
      context.dispatch("reset")
    },
    lobbyNotFoundEvent(context) {
      context.commit("setJoinError", "Could not find lobby.")
    },
    hostDisconnectedEvent(context) {
      context.dispatch("reset")
      Vue.notify({
        title: "Host Disconnected",
        type: "error",
        duration: 4000
      })
    }
  }
})

ws.onopen = () => {
  store.dispatch("connected")
}

ws.onmessage = ({ data: wsData }) => {
  const data = JSON.parse(wsData)
  store.dispatch(`${data.type}Event`, data.payload)
}

export default store
