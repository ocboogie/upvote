<template>
  <div class="posts">
    <Post 
      v-for="post in posts" 
      :key="post.id" 
      v-bind="post"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import Post from "./Post.vue";

export default {
  components: {
    Post
  },
  computed: mapState({
    posts: "posts"
  })
};
</script>

<style lang="scss" scoped>
</style>
