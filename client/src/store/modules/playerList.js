/* eslint-disable no-param-reassign */
import Vue from "vue";
import deepClone from "nanoclone";
import { emit } from "../../socket";

export default {
  state: [],
  mutations: {
    addPlayer(state, player) {
      return state.push(player);
    },
    removePlayer(state, player) {
      return state.splice(state.indexOf(player), 1);
    },
    clearPlayerList() {
      this.replaceState(
        Object.assign(deepClone(this.state), {
          playerList: []
        })
      );
    },
    addPlayersToList(state, playerList) {
      return state.push(...playerList);
    }
  },
  actions: {
    newPlayerEvent(context, player) {
      context.commit("addPlayer", player);
    },
    removePlayerEvent(context, player) {
      context.commit("removePlayer", player);
    }
  }
};
