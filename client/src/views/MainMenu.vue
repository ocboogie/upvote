<template>
  <div>
    <div class="main-menu">
      <div class="hero">
        <transition name="connecting-slide" mode="out-in">
          <div v-if="playerStage === 'connecting'" class="connecting">
            <orbit-spinner :size="100" color="#e74c3c" />
          </div>
          <img v-else alt="Vue logo" src="../assets/logo.png" />
        </transition>
      </div>
      <form @submit="onSubmit">
        <label class="name-label" for="nameInput">Enter your name</label>
        <awsom-input
          id="nameInput"
          v-model="name"
          :class="{ 'is-error': Boolean(error) }"
          type="text"
          class="name-input"
          placeholder="Name"
          autocomplete="off"
        />
        <transition name="scale-fade">
          <span v-if="Boolean(error)" class="error">{{ error }}</span>
        </transition>
        <awsom-button
          :disabled="playerStage === 'connecting'"
          native-type="submit"
          class="join-button"
        >
          Join
        </awsom-button>
        <awsom-button
          :disabled="playerStage === 'connecting'"
          native-type="button"
          type="info"
          class="private-game-button"
          @click.native="customGame"
        >
          Create private game
        </awsom-button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import OrbitSpinner from "@/components/OrbitSpinner.vue"
import AwsomInput from "@/components/AwsomInput.vue"
import AwsomButton from "@/components/AwsomButton.vue"

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
  methods: {
    ...mapActions(["joinLobby", "createLobby", "setJoinError"]),
    nameChcek() {
      if (!this.name) {
        this.setJoinError("You must enter a name.")
        return true
      }
      return false
    },
    onSubmit(e) {
      e.preventDefault()
      if (this.nameChcek()) {
        return
      }
      this.joinLobby(this.name)
    },
    customGame() {
      if (this.nameChcek()) {
        return
      }
      this.createLobby(this.name)
    }
  }
}
</script>
<style lang="scss" scoped>
.hero {
  height: 210px;
}
.connecting-slide-enter-active {
  transition: transform 0.25s cubic-bezier(0, 0, 0.1, 1);
}
.connecting-slide-enter {
  transform: translateY(-100%);
}

.connecting-slide-leave-active {
  transition: opacity 0.2s linear;
}
.connecting-slide-leave-to {
  opacity: 0;
}

.connecting {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.main-menu {
  background-color: $white;
  text-align: center;
  button {
    display: block;
    margin: auto;
    min-width: 100px;
    margin-top: 0.5rem;
  }
  .join-button {
    font-size: 1.5rem;
  }
  .private-game-button {
    font-size: 1.3rem;
  }
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