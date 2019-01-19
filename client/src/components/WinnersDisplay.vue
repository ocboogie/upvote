<template>
  <modal v-if="winners" type="unclosable" under-page-transition>
    <h2 class="title">{{ winnerText }}</h2>
    <div v-for="winner in winners" :key="winner.id">{{ winner.name }}</div>
  </modal>
</template>

<script>
import { mapGetters } from "vuex"
import Modal from "./Modal.vue"

export default {
  components: {
    Modal
  },
  computed: {
    ...mapGetters(["winners"]),
    winnerText() {
      if (!this.winners.length) {
        return "No Winner"
      }
      if (this.winners.length === 1) {
        return "Winner"
      }
      return "Winners"
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  margin-top: 0;
}
</style>
