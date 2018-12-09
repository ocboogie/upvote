import Vue from "vue"
import Router from "vue-router"
import { emit } from "./socket"
import store from "./store/index"
import MainMenu from "./views/MainMenu"

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "mainMenu",
      component: MainMenu,
      meta: { depth: 0 }
    },
    {
      path: "/lobby",
      name: "lobby",
      component: () =>
        import(/* webpackChunkName: "lobby" */ "./views/Lobby.vue"),
      meta: { requiresAuth: "on", depth: 1 }
    },
    {
      path: "/game",
      name: "game",
      component: () =>
        import(/* webpackChunkName: "game" */ "./views/Game.vue"),
      meta: { requiresAuth: "on", depth: 2 }
    },
    {
      path: "/loading/:screen",
      name: "loading",
      component: () =>
        import(/* webpackChunkName: "loading" */ "./views/Loading.vue"),
      meta: { requiresAuth: "on", depth: 1 }
    },

    { path: "*", redirect: "/" }
  ]
})

router.beforeEach((to, from, next) => {
  if (
    (store.state.player.stage === "connected" ||
      store.state.player.stage === "connecting") &&
    to.matched.some(
      record =>
        record.meta.requiresAuth === "on" || // `from.name` is null on page load
        (from.name === null && record.meta.requiresAuth === "pageLoad")
    )
  ) {
    next("/")
    return
  }
  next()
})

router.afterEach(to => {
  if (
    to.path === "/" &&
    store.state.player.stage !== "connecting" &&
    store.state.player.stage !== "connected"
  ) {
    emit("leaveLobby")
  }
})

const stageRouteMap = {
  inGame: "/game",
  waitingForGameToFinish: "/loading/waitingForGameToFinish",
  inLobby: "/lobby",
  connected: "/"
}

store.subscribe(mutation => {
  if (mutation.type !== "setStage") {
    return
  }

  const targetRoute = stageRouteMap[mutation.payload]
  if (targetRoute === router.currentRoute.path) {
    return
  }
  router.push(targetRoute)
})

export default router
