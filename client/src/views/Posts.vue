<template>
  <div class="posts">
    <template v-if="loginStage === 'loggedIn'">
      <post-form />
      <posts />
    </template>
    <div
      v-else
      class="must-logged-in-text">
      You must be logged in to see posts.
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PostForm from "@/components/PostForm.vue";
import Posts from "@/components/Posts.vue";

export default {
  components: {
    Posts,
    PostForm
  },
  computed: {
    ...mapState({
      loginStage: state => state.login.stage
    })
  }
};
</script>
<style lang="scss" scoped>
.must-logged-in-text {
  margin: auto;
  margin-top: 4rem;
  font-size: 1.5rem;
  line-height: 1.75rem;
  color: lighten($text-primary-color, 25%);
  text-align: center;
  a {
    text-decoration: none;
    color: $primary-color;
    display: block;
  }
}
</style>
