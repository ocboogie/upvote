<template>
  <div class="main-menu">
    <img 
      alt="Vue logo" 
      src="../assets/logo.png"
    >
    <form @submit="onSubmit">
      <label 
        class="name-label" 
        for="nameInput"
      >Enter your name</label>
      <awsom-input 
        id="nameInput" 
        v-model="name" 
        :class="{'is-error': Boolean(error)}" 
        type="text" 
        class="name-input" 
        placeholder="Name"
        autocomplete="off"
      />
      <transition name="scale-fade">
        <span 
          v-if="Boolean(error)" 
          class="error"
        >{{ error }}</span>
      </transition>
      <awsom-button 
        :loading="playerStage === 'connecting'"
        type="submit"
        class="start-button"
      >
        Start
        <template slot="loading">
          <orbit-spinner :size="25" />
        </template>
      </awsom-button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import OrbitSpinner from "@/components/OrbitSpinner";
import AwsomInput from "@/components/AwsomInput.vue";
import AwsomButton from "@/components/AwsomButton.vue";

export default {
  components: {
    AwsomInput,
    AwsomButton,
    OrbitSpinner
  },
  data: () => ({
    name: ""
  }),
  computed: mapState({
    error: state => state.player.error,
    playerStage: state => state.player.stage
  }),
  watch: {
    playerStage(playerStage) {
      if (playerStage === "inGame") {
        this.$router.push("/game");
      }
    }
  },
  methods: {
    ...mapActions(["joinGame", "setJoinError"]),
    onSubmit(e) {
      e.preventDefault();
      if (!this.name) {
        this.setError("You must enter a name.");
        return;
      }
      this.joinGame(this.name);
    }
  }
};
</script>
<style lang="scss" scoped>
.main-menu {
  background-color: $white;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  z-index: 1;
  text-align: center;
}

.name-label {
  font-size: 1.85rem;
  display: block;
  margin: auto;
  margin-bottom: 0.5rem;
  text-align: center;
}
/* Using Id for a higher priority */
#nameInput {
  font-size: 2rem;
  display: block;
  max-width: 360px;
  margin: auto;
  margin-bottom: 0.5rem;
  padding: 5px 0;

  text-align: center;
  display: block;
}
.error {
  font-size: 1.4rem;
  color: $error-color;
  display: block;
}
.start-button {
  min-width: 100px;
  margin-top: 0.5rem;
  font-size: 1.5rem;
}
.scale-fade-enter-active {
  transition: font-size 0.2s ease, opacity 0.1s ease-out 0.15s;
}
.scale-fade-leave-active {
  transition: opacity 0.1s ease, font-size 0.2s ease-out 0.05s;
}
.scale-fade-enter,
.scale-fade-leave-to {
  opacity: 0;
  font-size: 0rem;
}
</style>