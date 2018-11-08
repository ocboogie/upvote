/* eslint-disable no-param-reassign */
import Vue from "vue";
import { emit } from "../../socket";

export default {
  state: {
    posts: {},
    players: [],
    lobbyId: null,
    isHost: false
  },
  mutations: {
    setPost(state, post) {
      Vue.set(state.posts, post.id, post);
    },
    setPosts(state, posts) {
      state.posts = posts;
    },
    clearPosts(state) {
      state.posts = {};
    },
    updatePosts(state, posts) {
      Object.entries(posts).forEach(([id, modPost]) => {
        Vue.set(state.posts, id, {
          ...state.posts[id],
          ...modPost
        });
      });
    },
    updatePost(state, payload) {
      Vue.set(state.posts, payload.id, {
        ...state.posts[payload.id],
        ...payload.modPost
      });
    },
    removePosts(state, postIds) {
      postIds.forEach(postId => {
        Vue.delete(state.posts, postId);
      });
    },
    vote(state, payload) {
      const post = state.posts[payload.id];
      Vue.set(post, "vote", payload.vote);
    },

    addPlayer(state, player) {
      state.players.push(player);
    },
    setPlayers(state, players) {
      state.players = players;
    },
    removePlayer(state, player) {
      state.players.splice(state.players.indexOf(player), 1);
    },
    clearPlayers(state) {
      state.players = [];
    },

    setLobbyId(state, lobbyId) {
      state.lobbyId = lobbyId;
    },
    setIsHost(state, isHost) {
      state.isHost = isHost;
    }
  },
  actions: {
    setPost(context, post) {
      context.commit("setPost", post);
    },
    vote(context, payload) {
      emit("vote", payload);
      context.commit("vote", payload);
    },
    post(context, content) {
      emit("post", content);
    },

    newPostEvent(context, post) {
      context.commit("setPost", post);
    },
    updatePostsEvent(context, data) {
      context.commit("updatePosts", data);
    },
    updatePostEvent(context, data) {
      context.commit("updatePost", data);
    },
    removePostsEvent(context, postIds) {
      context.commit("removePosts", postIds);
    },
    newPlayerEvent(context, player) {
      context.commit("addPlayer", player);
    },
    removePlayerEvent(context, player) {
      context.commit("removePlayer", player);
    }
  },
  getters: {
    sortedPosts: state =>
      Object.values(state.posts).sort(
        (postA, postB) => postB.upvotes - postA.upvotes
      )
  }
};
