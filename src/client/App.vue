<template>
  <div id="app">
    <login v-if="stage === 'signedOut'" />
    <template v-else>
      <post-form />
      <posts />
    </template>
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

<style lang="scss">
@import "@/variables.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
