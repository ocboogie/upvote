<template>
  <div id="app">
    <transition 
      :name="transitionName" 
      :appear="false"
      mode="in-out">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import { emit } from "./socket";
import { mapActions } from "vuex";

export default {
  data: () => ({ transitionName: "" }),
  watch: {
    $route(to, from) {
      // The `from.name !== null` is to prevent the animation on page load
      if (to.path === "/" && from.name !== null) {
        this.transitionName = "main-menu-slide-in";
        if (this.$store.state.player.stage === "inGame") {
          emit("leaveLobby");
        }
        return;
      }
      if (from.path === "/") {
        this.transitionName = "main-menu-slide-out";
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-menu-slide-in-enter-active {
  transition: transform 0.25s cubic-bezier(0, 0, 0.3, 1),
    opacity 0.1s linear 0.1s;
}

.main-menu-slide-out-leave-active {
  transition: transform 0.25s cubic-bezier(0.5, 0, 1, 1),
    opacity 0.1s linear 0.1s;
}

.main-menu-slide-in-enter,
.main-menu-slide-out-leave-to {
  transform: translateY(100vh);
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
