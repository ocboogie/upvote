<template>
  <modal v-if="winners" type="unclosable" under-page-transition>
    <h2 class="title">{{ winnerText }}</h2>
    <div v-for="winner in winners" :key="winner">{{ winner }}</div>
  </modal>
</template>

<script>
import { mapState } from "vuex"
import Modal from "./Modal.vue"

export default {
  components: {
    Modal
  },
  computed: {
    ...mapState({
      winners: state => state.lobby.winners
    }),
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
