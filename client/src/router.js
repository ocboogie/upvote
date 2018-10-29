import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "mainMenu",
      component: () =>
        import(/* webpackChunkName: "mainMenu" */ "./views/MainMenu.vue")
    },
    {
      path: "/lobby",
      name: "lobby",
      component: () =>
        import(/* webpackChunkName: "lobby" */ "./views/Lobby.vue")
    },
    {
      path: "/game",
      name: "game",
      component: () =>
        import(/* webpackChunkName: "game" */ "./views/Game.vue"),
      meta: { requiresAuth: "pageLoad" }
    },
    { path: "*", redirect: "/" }
  ]
});

router.beforeEach((to, from, next) => {
  if (
    store.state.user.stage !== "inGame" &&
    to.matched.some(
      record =>
        record.meta.requiresAuth === "on" || // `from.name` is null on page load
        (from.name === null && record.meta.requiresAuth === "pageLoad")
    )
  ) {
    next("/");
    return;
  }
  next();
});

export default router;
