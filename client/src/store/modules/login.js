/* eslint-disable no-param-reassign */
import { emit } from "../../socket";

export default {
  state: {
    stage: "connecting",
    name: null,
    error: null
  },
  mutations: {
    setStage(state, loginState) {
      state.stage = loginState;
    },
    setName(state, name) {
      state.name = name;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    login(context, name) {
      context.commit("setName", name);
      emit("login", name);
    },
    connected(context) {
      context.commit("setStage", "signedOut");
    },
    setError(context, error) {
      context.commit("setError", error);
    },

    existingUserEvent(context) {
      context.commit("setError", "Existing user with that name.");
    },
    alreadyLoggedInEvent(context) {
      context.commit("setError", "You're already logged in.");
    },
    signedOutEvent(context) {
      context.commit("setStage", "signedOut");
      context.commit("clearPosts");
    }
  }
};
