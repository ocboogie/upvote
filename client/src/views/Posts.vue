<template>
  <div class="posts-page">
    <template v-if="loginStage === 'loggedIn'">
      <div class="content-body">
        <post-form class="post-form" />
        <posts />
      </div>
      <div class="user-list-container">
        <user-list />
      </div>
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
import UserList from "@/components/UserList.vue";

export default {
  components: {
    Posts,
    PostForm,
    UserList
  },
  computed: {
    ...mapState({
      loginStage: state => state.login.stage
    })
  }
};
</script>
<style lang="scss" scoped>
.posts-page {
  display: flex;
  .content-body {
    flex: 0.7;
    margin-right: 0.5rem;
    .post-form {
      margin-bottom: 1rem;
    }
  }
  .user-list-container {
    flex: 0.3;
    margin-left: 0.5rem;
  }
}
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
