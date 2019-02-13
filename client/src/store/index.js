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
    createLobby(context, { name, avatar }) {
      emit("createLobby", { name, avatar })
    },
    joinLobby(context, { name, avatar }) {
      emit("joinLobby", {
        avatar,
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

    gameStartedWs(context, { prompt, timeTillRoundEnd }) {
      context.commit("setPrompt", prompt)
      context.commit("setRoundEndAt", new Date(Date.now() + timeTillRoundEnd))
      context.commit("setStage", "inGame")
      context.commit("clearPosts")
      context.commit("setWinners", null)
    },
    joinedGameWs(
      context,
      { playerId, players, posts, timeTillRoundEnd, prompt }
    ) {
      context.dispatch("connectedToALobby", { playerId, players })
      context.commit("setPrompt", prompt)
      context.commit("setRoundEndAt", new Date(Date.now() + timeTillRoundEnd))
      context.commit("setStage", "inGame")
      context.commit(
        "setPosts",
        posts.reduce((postObj, post) => {
          postObj[post.id] = post
          return postObj
        }, {})
      )
      if (context.state.player.error) {
        context.commit("setJoinError", null)
      }
    },
    joinedLobbyWs(context, { playerId, players, lobbyId }) {
      context.dispatch("connectedToALobby", { playerId, players })
      context.commit("setStage", "inLobby")
      context.commit("setLobbyId", lobbyId)
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
