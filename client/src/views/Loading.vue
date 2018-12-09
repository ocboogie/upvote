<template>
  <div class="loading-page">
    <h1 class="title">{{ screenInfo.text }}</h1>
    <orbit-spinner class="spinner" :size="100" color="#e74c3c" />
  </div>
</template>
<script>
import loadingScreens from "@/loadingScreens"
import OrbitSpinner from "@/components/OrbitSpinner.vue"

export default {
  components: {
    OrbitSpinner
  },
  computed: {
    screenInfo() {
      return loadingScreens[this.$route.params.screen]
    }
  },
  beforeRouteEnter(to, from, next) {
    const screenInfo = loadingScreens[to.params.screen]
    if (!screenInfo.redirect) {
      return
    }
    screenInfo.redirect(to, from, next)
  }
}
</script>
<style lang="scss" scoped>
.loading-page {
  padding-top: 5rem;
  text-align: center;
  .title {
    margin-bottom: 2.5rem;
  }
  .spinner {
    margin: auto;
  }
}
</style>
