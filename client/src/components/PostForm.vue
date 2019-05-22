<template>
  <form :class="{ 'full-width': fullWidth }" @submit="submit">
    <base-input
      v-model="content"
      class="content-input"
      placeholder="Post content"
      maxlength="60"
      flush-right
    />
    <base-button native-type="submit" flush-left>Post</base-button>
  </form>
</template>
<script>
import { mapActions } from "vuex"

export default {
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
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

<style lang="scss" scoped>
.full-width {
  width: 100%;
  display: flex;
  .content-input {
    flex-grow: 1;
  }
}
</style>
