/* eslint-disable no-param-reassign */
import Vue from "vue";
import Vuex from "vuex";
import ws from "../socket";
import user from "./modules/user";
import posts from "./modules/posts";
import userList from "./modules/userList";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    posts,
    userList
  },
  actions: {
    joinedGameEvent(context, payload) {
      context.commit("setStage", "inGame");
      context.commit("setPosts", payload.posts);
      context.commit("addUsersToList", payload.userList);
      if (context.state.user.error) {
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
