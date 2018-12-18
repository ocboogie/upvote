<template>
  <div>
    <div>You have been disconnected from the server.</div>
    <base-button class="reload" @click.native="reload" @keyup.enter="close">
      Reload
    </base-button>
  </div>
</template>

<script>
export default {
  modal: {
    type: "unclosable"
  },
  methods: {
    reload() {
      document.location.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.reload {
  margin-top: 1rem;
}
</style>
