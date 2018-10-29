/* eslint-disable no-param-reassign */
import Vue from "vue";
import deepClone from "nanoclone";
import { emit } from "../../socket";

export default {
  state: [],
  mutations: {
    addUser(state, user) {
      return state.push(user);
    },
    removeUser(state, user) {
      return state.splice(state.indexOf(user), 1);
    },
    clearUserList() {
      this.replaceState(
        Object.assign(deepClone(this.state), {
          userList: []
        })
      );
    },
    addUsersToList(state, userList) {
      return state.push(...userList);
    }
  },
  actions: {
    newUserEvent(context, user) {
      context.commit("addUser", user);
    },
    removeUserEvent(context, user) {
      context.commit("removeUser", user);
    }
  }
};
