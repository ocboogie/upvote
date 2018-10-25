import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import router from "./router";

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
