/* eslint-disable no-param-reassign */
import { emit } from "../../socket";

export default {
  state: {
    stage: "signedOut",
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
    }
  }
};
