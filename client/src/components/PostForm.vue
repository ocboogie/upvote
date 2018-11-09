<template>
  <form @submit="submit">
    <base-input v-model="content" placeholder="Post content" />
    <base-button native-type="submit">Post</base-button>
  </form>
</template>
<script>
import { mapActions } from "vuex"

export default {
  data: () => ({ content: "" }),
  methods: {
    ...mapActions(["post"]),
    submit(e) {
      e.preventDefault()
      if (!this.content) {
        return
      }
      this.post(this.content)
      this.content = ""
    }
  }
}
</script>

<style lang="scss" scoped></style>
