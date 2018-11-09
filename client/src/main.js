import Vue from "vue"
import Notifications from "vue-notification"
import App from "./App.vue"
import store from "./store/index"
import router from "@/router"
import "./components/_globals"

Vue.use(Notifications)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")
