export default {
  state: {
    stage: "connecting",
    name: null,
    error: null
  },
  mutations: {
    setStage(state, playerStage) {
      state.stage = playerStage
    },
    setName(state, name) {
      state.name = name
    },
    setJoinError(state, error) {
      state.error = error
    }
  },
  actions: {
    connected(context) {
      context.commit("setStage", "connected")
    },
    setJoinError(context, error) {
      context.commit("setJoinError", error)
    },

    existingPlayerWs(context) {
      context.commit("setJoinError", "Existing player with that name.")
    },
    alreadyInALobbyWs(context) {
      context.commit("setJoinError", "You're already in a lobby.")
    },
    lobbyNotFoundWs(context) {
      context.commit("setJoinError", "Could not find lobby.")
    }
  }
}
