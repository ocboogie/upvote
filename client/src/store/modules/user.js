/* eslint-disable no-param-reassign */
import { emit } from "../../socket";

export default {
  state: {
    stage: "connecting",
    name: null,
    error: null
  },
  mutations: {
    setStage(state, userStage) {
      state.stage = userStage;
    },
    setName(state, name) {
      state.name = name;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    joinGame(context, name) {
      context.commit("setName", name);
      emit("joinGame", name);
    },
    connected(context) {
      context.commit("setStage", "inMainMenu");
    },
    setError(context, error) {
      context.commit("setError", error);
    },

    existingUserEvent(context) {
      context.commit("setError", "Existing user with that name.");
    },
    alreadyInALobbyEvent(context) {
      context.commit("setError", "You're already in a lobby.");
    },
    leftLobbyEvent(context) {
      context.commit("setStage", "inMainMenu");
      context.commit("clearPosts");
      context.commit("clearUserList");
    }
  }
};
