import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/",
      name: "posts",
      component: () =>
        import(/* webpackChunkName: "posts" */ "./views/Posts.vue"),
      meta: { requiresAuth: "pageLoad" }
    },
    { path: "*", redirect: "/login" }
  ]
});

router.beforeEach((to, from, next) => {
  if (
    store.state.login.stage !== "loggedIn" &&
    to.matched.some(
      record =>
        record.meta.requiresAuth === "on" || // `from.name` is null on page load
        (from.name === null && record.meta.requiresAuth === "pageLoad")
    )
  ) {
    next("/login");
    return;
  }
  next();
});

export default router;
