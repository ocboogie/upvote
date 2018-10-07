import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from "./App.vue";
import store from "./store/index";

library.add(faArrowUp);

Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
