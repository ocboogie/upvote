/* eslint-disable no-param-reassign */
import Vue from "vue";
import Vuex from "vuex";
import ws from "../socket";
import player from "./modules/player";
import posts from "./modules/posts";
import playerList from "./modules/playerList";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    player,
    posts,
    playerList
  },
  actions: {
    joinedGameEvent(context, payload) {
      context.commit("setStage", "inGame");
      context.commit("setPosts", payload.posts);
      context.commit("addPlayersToList", payload.playerList);
      if (context.state.player.error) {
        context.commit("setError", null);
      }
    }
  }
});

ws.onopen = () => {
  store.dispatch("connected");
};

ws.onmessage = ({ data: wsData }) => {
  const data = JSON.parse(wsData);
  store.dispatch(`${data.type}Event`, data.payload);
};

export default store;
