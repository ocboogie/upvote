<template>
  <base-card class="player-list">
    <h3 class="header">Players</h3>
    <!-- TODO: Add a group transition -->
    <ul class="list">
      <li v-for="{ name, id } in players" :key="id" class="player">
        {{ name }} <span v-if="id === playerId" class="you-label"> (you)</span>
      </li>
    </ul>
  </base-card>
</template>
<script>
import { mapState } from "vuex"

export default {
  computed: {
    ...mapState({
      players: state => state.lobby.players,
      playerId: state => state.player.id
    })
  }
}
</script>
<style lang="scss" scoped>
.player-list {
  .header {
    margin-top: 0;
    margin-bottom: 0.3rem;
  }
  .list {
    line-height: 1.35;
    list-style-type: none;
    padding-left: 0.5rem;
    margin-top: 0;
    margin-bottom: 0;
    .you-label {
      color: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>
