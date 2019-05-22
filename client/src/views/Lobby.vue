<template>
  <div>
    <div class="lobby-page">
      <player-list class="player-list" />
      <base-card class="lobby">
        <h1 class="header">Lobby</h1>
        <div v-if="hosting" class="settings">
          <div class="setting-group">
            <label for="roundTime">Round time</label>
            <base-input
              id="roundTime"
              v-model.number="roundTime"
              type="number"
            />
            <small class="help-text">The amount of time for each round.</small>
          </div>
          <div class="setting-group">
            <label for="promptList">Prompts</label>
            <base-input
              id="promptList"
              v-model="prompts"
              placeholder="Type your prompts here separated by new lines"
              multiline
            />
            <small class="help-text">
              Example: "prompt 1 <br />
              prompt 2 <br />
              prompt 3".
            </small>
          </div>
        </div>
        <div v-else-if="playerStage === 'inLobby'" class="not-hosting-info">
          Waiting for host to start
        </div>
        <base-button
          :disabled="!hosting"
          class="start-button"
          @click.native="start"
        >
          Start
        </base-button>
        <label for="invite-url">Invite URL</label>
        <base-input
          id="invite-url"
          v-model="inviteUrl"
          class="invite-url"
          readonly
        />
      </base-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import PlayerList from "@/components/PlayerList.vue"

export default {
  components: {
    PlayerList
  },
  data: () => ({
    prompts: "",
    roundTime: 60
  }),
  computed: {
    ...mapState({
      playerStage: state => state.player.stage,
      lobbyId: state => state.lobby.lobbyId,
      hosting: state => state.lobby.hosting
    }),
    inviteUrl() {
      return `${window.location.origin}/?${this.lobbyId}`
    }
  },
  methods: {
    ...mapActions(["startGame"]),
    start() {
      this.startGame({ prompts: this.prompts, roundTime: this.roundTime })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path !== "/game") {
      next()
      return
    }
    next("/")
  }
}
</script>
<style lang="scss" scoped>
.lobby-page {
  background-color: $white;
  display: flex;
  justify-content: center;

  .player-list {
    order: 3;
    min-width: 200px;
    margin-left: 0.5rem;
  }
  .lobby {
    margin-right: 0.5rem;
    text-align: center;
    width: 100%;
    max-width: 450px;
    .header {
      font-weight: 300;
      margin-top: 0;
      margin-bottom: 0.75rem;
    }
    .settings {
      text-align: left;
      display: block;
      margin-bottom: 1rem;
      .setting-group {
        display: block;
        width: 100%;
        margin-bottom: 1.5rem;
        input {
          display: block;
        }
        .help-text {
          color: $text-muted;
          display: block;
          margin-top: 0.25rem;
        }
      }
    }
    .not-hosting-info {
      margin-bottom: 1rem;
    }
    .start-button {
      margin: auto;
      display: block;
      margin-bottom: 2rem;
    }
    .invite-url {
      margin: auto;
      display: block;
      margin-top: 0.5rem;
      width: 100%;
      text-align: center;
    }
  }

  @include small {
    flex-direction: column;
    .player-list {
      order: -1;
      margin-bottom: 1rem;
    }
    .lobby {
      margin: auto;
      max-width: none;
    }
  }
}
</style>
