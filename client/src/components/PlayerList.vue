<template>
  <div class="player-list">
    <h3 class="header">Players</h3>
    <!-- TODO: Add a group transition -->
    <ul class="list">
      <li v-for="{ name, avatar, id } in players" :key="id" class="player">
        <avatar class="avatar" :avatar-data="avatar" />
        <div class="name">{{ name }}</div>
        <div v-if="id === playerId" class="you-label">&nbsp;(you)</div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex"
import Avatar from "./Avatar.vue"

export default {
  components: {
    Avatar
  },
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
  max-width: 250px;
  .header {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  .list {
    line-height: 3.35;
    list-style-type: none;
    padding-left: 0rem;
    margin-top: 0;
    margin-bottom: 0;
    .player {
      // height: 33px;
      height: calc(25px + 0.5rem);
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      &:not(:last-child) {
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid $border-lighter-color;
      }
      .avatar {
        height: 25px;
        width: 25px;
        margin-right: 5px;
        flex-shrink: 0;
      }
      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .you-label {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}
</style>
