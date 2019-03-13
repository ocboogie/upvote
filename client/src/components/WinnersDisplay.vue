<template>
  <modal v-if="winners" type="unclosable" under-page-transition>
    <h2 class="title">{{ winnerText }}</h2>
    <div class="winners">
      <div v-for="winner in winners" :key="winner.id" class="winner">
        <avatar class="avatar" :avatar-data="winner.avatar" rainbow />
        <div class="name">{{ winner.name }}</div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from "vuex"
import Modal from "./Modal.vue"
import Avatar from "./Avatar.vue"

export default {
  components: {
    Modal,
    Avatar
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
.winners {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  .winner {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    .avatar {
      width: 150px;
      border: 1px solid $border-lighter-color;
    }
  }
}
</style>
