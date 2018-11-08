<template>
  <div class="game-page">
    <div class="content-body">
      <post-form class="post-form" />
      <posts />
    </div>
    <div class="player-list-container"><player-list /></div>
  </div>
</template>

<script>
import PostForm from "@/components/PostForm.vue"
import Posts from "@/components/Posts.vue"
import PlayerList from "@/components/PlayerList.vue"

export default {
  components: {
    Posts,
    PostForm,
    PlayerList
  }
}
</script>
<style lang="scss" scoped>
.game-page {
  padding: 1rem;
  display: flex;
  .content-body {
    flex: 0.7;
    margin-right: 0.5rem;
    .post-form {
      margin-bottom: 1rem;
    }
  }
  .player-list-container {
    flex: 0.3;
    margin-left: 0.5rem;
  }
}
</style>
