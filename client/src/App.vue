<template>
  <div id="app">
    <div :class="transition">
      <transition
        :name="`route-${transition}`"
        mode="in-out"
        @after-leave="clearTransition"
      >
        <router-view />
      </transition>
    </div>
    <notifications classes="notification" />
  </div>
</template>
<script>
import { mapState } from "vuex"
import "./components/AwsomButton.vue"

export default {
  data: () => ({ transition: "" }),
  computed: mapState({
    playerStage: state => state.player.stage
  }),
  watch: {
    $route(to, from) {
      // Prevent page animation on page load
      if (from.name === null) {
        return
      }

      if (to.meta.depth > from.meta.depth) {
        this.transition = "slide-out"
      } else {
        this.transition = "slide-in"
      }
    }
  },
  methods: {
    clearTransition() {
      this.transition = ""
    }
  }
}
</script>

<style lang="scss">
body,
html {
  padding: 0;
  margin: 0;
}

.notification {
  padding: 10px;
  margin: 0 5px 5px;
  border-radius: 1.25px;

  font-size: 1rem;

  color: $white;
  background: $primary-color;
  border-left: 5px solid darken($primary-color, 10%);

  &.error {
    background: $error-color;
    border-left-color: darken($error-color, 27.5%);
  }
}
</style>

<style lang="scss" scoped>
.slide-in > *:last-child,
.slide-out > *:first-child {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: $white;
  z-index: 10;
}

.route-slide-in-enter-active {
  transition: transform 0.25s cubic-bezier(0, 0, 0.3, 1),
    opacity 0.1s linear 0.1s;
}

.route-slide-out-leave-active {
  transition: transform 0.25s cubic-bezier(0.5, 0, 1, 1),
    opacity 0.1s linear 0.05s;
}

.route-slide-in-enter,
.route-slide-out-leave-to {
  opacity: 0;
  transform: translateY(100vh);
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
