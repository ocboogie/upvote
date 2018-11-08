<template>
  <div>
    <div class="lobby-page">
      <player-list class="player-list" />
      <awsom-card class="lobby">
        <h1 class="header">Lobby</h1>
        <awsom-button
          :disabled="!isHost && playerStage === 'inLobby'"
          class="start-button"
          @click.native="
            () => (playerStage === 'inGame' ? backToGame() : startGame());
          "
        >
          {{ playerStage === "inGame" ? "Back to game" : "Start" }}
        </awsom-button>
        <label for="invite-url">Invite URL</label>
        <awsom-input
          id="invite-url"
          v-model="inviteUrl"
          class="invite-url"
          readonly
        />
      </awsom-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AwsomInput from "@/components//AwsomInput.vue";
import AwsomButton from "@/components/AwsomButton.vue";
import AwsomCard from "@/components/AwsomCard.vue";
import PlayerList from "@/components/PlayerList.vue";

export default {
  components: {
    AwsomInput,
    AwsomButton,
    AwsomCard,
    PlayerList
  },
  computed: {
    ...mapState({
      playerStage: state => state.player.stage,
      lobbyId: state => state.lobby.lobbyId,
      isHost: state => state.lobby.isHost
    }),
    inviteUrl() {
      return `${window.location.origin}/?${this.lobbyId}`;
    }
  },
  methods: {
    ...mapActions(["startGame"]),
    backToGame() {
      this.$router.push("game");
    }
  }
};
</script>
<style lang="scss" scoped>
.lobby-page {
  background-color: $white;
  display: flex;
  justify-content: center;

  .player-list {
    order: 3;
    min-width: 150px;
    margin-left: 0.5rem;
  }
  .lobby {
    margin-right: 0.5rem;
    text-align: center;
    width: 100%;
    max-width: 500px;
    .header {
      font-weight: 300;
      margin-top: 0;
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
      width: 90%;
      text-align: center;
    }
  }
}
</style>
