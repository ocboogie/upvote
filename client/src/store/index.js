/* eslint-disable no-param-reassign */
import Vue from "vue";
import Vuex from "vuex";
import ws from "../socket";
import login from "./modules/login";
import posts from "./modules/posts";
import userList from "./modules/userList";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    login,
    posts,
    userList
  },
  actions: {
    loggedInEvent(context, payload) {
      context.commit("setStage", "loggedIn");
      context.commit("setPosts", payload.posts);
      context.commit("addUsersToList", payload.userList);
      if (context.state.login.error) {
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
