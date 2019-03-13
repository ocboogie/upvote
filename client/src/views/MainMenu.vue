<template>
  <div>
    <div class="main-menu">
      <div class="hero">
        <transition name="connecting-slide" mode="out-in">
          <logo
            v-if="playerStage !== 'connecting' && logoLoaded"
            width="200px"
            height="200px"
          />
          <div v-else class="connecting">
            <orbit-spinner :size="100" color="#e74c3c" />
          </div>
        </transition>
      </div>

      <base-card class="user-input">
        <form class="form-section" @submit="onSubmit">
          <base-input
            id="nameInput"
            v-model="name"
            :class="{ 'is-error': Boolean(error) }"
            type="text"
            class="name-input"
            placeholder="Name"
            autocomplete="off"
          />
          <avatar-editor ref="avatarEditor" class="avatar-editor" />
          <base-button
            :disabled="playerStage === 'connecting'"
            native-type="submit"
            class="join-button"
          >
            Join
          </base-button>
          <transition name="scale-fade">
            <span v-if="Boolean(error)" class="error">{{ error }}</span>
          </transition>
          <base-button
            :disabled="playerStage === 'connecting'"
            native-type="button"
            type="info"
            class="private-game-button"
            @click.native="customGame"
          >
            Create private game
          </base-button>
        </form>
      </base-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import logoPath from "../assets/logo.png"
import OrbitSpinner from "@/components/OrbitSpinner.vue"
import Logo from "@/components/Logo.vue"
import AvatarEditor from "@/components/AvatarEditor.vue"

// This is use to prevent preloading when the image is already cached
let alreadyLoadedImage = false

export default {
  components: {
    OrbitSpinner,
    Logo,
    AvatarEditor
  },
  data: () => ({
    name: "",
    logoLoaded: alreadyLoadedImage
  }),
  computed: mapState({
    error: state => state.player.error,
    playerStage: state => state.player.stage
  }),
  mounted() {
    if (!alreadyLoadedImage) {
      // Load the image before running the image transition
      const image = new Image()
      image.src = logoPath
      image.onload = () => {
        this.logoLoaded = true
        alreadyLoadedImage = true
      }
    }
  },
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

      const avatarData = this.$refs.avatarEditor.intoData()

      this.joinLobby({ name: this.name, avatar: avatarData })
    },
    customGame() {
      if (this.nameChcek()) {
        return
      }

      const avatarData = this.$refs.avatarEditor.intoData()

      this.createLobby({ name: this.name, avatar: avatarData })
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

  .user-input {
    max-width: 300px;
    margin: auto;
    .form-section {
      .avatar-editor {
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid $border-lighter-color;
      }

      /* Using Id for a higher priority fixing
         weird priority issues in production */
      #nameInput {
        font-size: 2rem;
        display: block;
        width: 100%;
        margin-bottom: 0.5rem;
        padding: 25px 10px;
      }

      .error {
        margin-top: 0.5rem;
        font-size: 1.4rem;
        color: $error-color;
        display: block;
      }
      .scale-fade-enter-active {
        transition: font-size 0.2s ease, opacity 0.1s ease-out 0.15s,
          margin-top 0.2s ease;
      }
      .scale-fade-leave-active {
        transition: opacity 0.1s ease, font-size 0.2s ease-out 0.05s,
          margin-top 0.2s ease-out 0.05s;
      }
      .scale-fade-enter,
      .scale-fade-leave-to {
        margin-top: 0;
        opacity: 0;
        font-size: 0rem;
      }

      .join-button,
      .private-game-button {
        display: block;
        margin-top: 0.5rem;
        width: 100%;
      }
      .join-button {
        font-size: 1.5rem;
      }
      .private-game-button {
        font-size: 1.3rem;
      }
    }
  }
}
</style>
