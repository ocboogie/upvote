import Vue from "vue"
import App from "./App.vue"
import store from "./store/index"
import router from "@/router"
import "./components/_globals"

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")
