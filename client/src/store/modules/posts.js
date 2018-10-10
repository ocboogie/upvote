/* eslint-disable no-param-reassign */
import Vue from "vue";
import { emit } from "../../socket";

export default {
  state: {},
  mutations: {
    setPost(state, post) {
      Vue.set(state, post.id, post);
    },
    setPosts(state, posts) {
      posts.forEach(post => {
        Vue.set(state, post.id, post);
      });
    },
    updatePost(state, data) {
      state[data.id] = { ...state[data.id], ...data.modPost };
    },
    removePosts(state, postIds) {
      postIds.forEach(postId => {
        Vue.delete(state, postId);
      });
    },
    vote(state, payload) {
      const post = state[payload.id];
      Vue.set(post, "vote", payload.vote);
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
    updatePostEvent(context, data) {
      context.commit("updatePost", data);
    },
    removePostsEvent(context, postIds) {
      context.commit("removePosts", postIds);
    }
  },
  getters: {
    sortedPosts: state =>
      Object.values(state).sort((postA, postB) => postB.upvotes - postA.upvotes)
  }
};
