import Vue from "vue"
import { emit } from "../../socket"

export default {
  state: {
    posts: {},
    players: {},
    lobbyId: null,
    prompt: null,
    roundEndAt: null,
    winners: null,
    hosting: false
  },
  mutations: {
    setPost(state, post) {
      Vue.set(state.posts, post.id, post)
    },
    setPosts(state, posts) {
      state.posts = posts
    },
    clearPosts(state) {
      state.posts = {}
    },
    updatePosts(state, posts) {
      Object.entries(posts).forEach(([id, modPost]) => {
        Vue.set(state.posts, id, {
          ...state.posts[id],
          ...modPost
        })
      })
    },
    updatePost(state, { id, modPost }) {
      Vue.set(state.posts, id, {
        ...state.posts[id],
        ...modPost
      })
    },
    removePosts(state, postIds) {
      postIds.forEach(postId => {
        Vue.delete(state.posts, postId)
      })
    },
    vote(state, { id, vote }) {
      const post = state.posts[id]
      Vue.set(post, "vote", vote)
    },

    addPlayer(state, player) {
      Vue.set(state.players, player.id, player)
    },
    addPlayers(state, players) {
      players.forEach(player => {
        Vue.set(state.players, player.id, player)
      })
    },
    removePlayer(state, playerId) {
      Vue.delete(state.players, playerId)
    },
    clearPlayers(state) {
      state.players = {}
    },

    setLobbyId(state, lobbyId) {
      state.lobbyId = lobbyId
    },
    setPrompt(state, prompt) {
      state.prompt = prompt
    },
    setRoundEndAt(state, roundEndAt) {
      state.roundEndAt = roundEndAt
    },
    setWinners(state, winners) {
      state.winners = winners
    },
    setHosting(state, hosting) {
      state.hosting = hosting
    }
  },
  actions: {
    setPost(context, post) {
      context.commit("setPost", post)
    },
    vote(context, payload) {
      emit("vote", payload)
      context.commit("vote", payload)
    },
    post(context, content) {
      emit("post", content)
    },

    newPostWs(context, post) {
      context.commit("setPost", post)
    },
    updatePostsWs(context, data) {
      context.commit("updatePosts", data)
    },
    updatePostWs(context, data) {
      context.commit("updatePost", data)
    },
    removePostsWs(context, postIds) {
      context.commit("removePosts", postIds)
    },
    newPlayerWs(context, player) {
      context.commit("addPlayer", player)
    },
    removePlayerWs(context, player) {
      context.commit("removePlayer", player)
    }
  },
  getters: {
    winners: state => {
      if (!state.winners) {
        return null
      }
      return state.winners.map(winnerId => state.players[winnerId])
    },
    sortedPosts: state =>
      Object.values(state.posts).sort(
        (postA, postB) => postB.upvotes - postA.upvotes
      )
  }
}
