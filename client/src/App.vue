<template>
  <div id="app">
    <transition name="login-fade">
      <login 
        v-if="stage !== 'loggedIn'" 
        class="login" />
      <div v-else>
        <post-form />
        <posts />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Login from "./components/Login.vue";
import Posts from "./components/Posts.vue";
import PostForm from "./components/PostForm.vue";

export default {
  components: {
    Login,
    Posts,
    PostForm
  },
  computed: mapState({
    stage: state => state.login.stage
  })
};
</script>

<style lang="scss" scoped>
.login {
  background-color: $white;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
}
.login-fade-leave-active {
  transition: transform 0.25s cubic-bezier(0.7, 0, 1, 1),
    opacity 0.1s linear 0.1s;
}

.login-fade-leave-to {
  transform: translateY(100vh);
  opacity: 0;
}
</style>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
