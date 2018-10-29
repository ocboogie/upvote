/* eslint-disable no-param-reassign */
import { emit } from "../../socket";

export default {
  state: {
    stage: "connecting",
    name: null,
    error: null
  },
  mutations: {
    setStage(state, playerStage) {
      state.stage = playerStage;
    },
    setName(state, name) {
      state.name = name;
    },
    setJoinError(state, error) {
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
    setJoinError(context, error) {
      context.commit("setJoinError", error);
    },

    existingPlayerEvent(context) {
      context.commit("setJoinError", "Existing player with that name.");
    },
    alreadyInALobbyEvent(context) {
      context.commit("setJoinError", "You're already in a lobby.");
    },
    leftLobbyEvent(context) {
      context.commit("setStage", "inMainMenu");
      context.commit("clearPosts");
      context.commit("clearPlayerList");
    }
  }
};
