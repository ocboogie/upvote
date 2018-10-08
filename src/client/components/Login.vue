<template>
  <div class="login">
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
        type="text" 
        class="name-input" 
        :class="{'is-error': Boolean(error)}" 
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
        type="submit" 
        class="start-button"
      >Start</awsom-button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AwsomInput from "./AwsomInput.vue";
import AwsomButton from "./AwsomButton.vue";

export default {
  components: {
    AwsomInput,
    AwsomButton
  },
  data: () => ({
    name: ""
  }),
  computed: {
    ...mapState({
      error: state => state.login.error
    })
  },
  methods: {
    ...mapActions(["login", "setError"]),
    onSubmit(e) {
      e.preventDefault();
      if (!this.name) {
        this.setError("You must enter a name.");
        return;
      }
      this.login(this.name);
    }
  }
};
</script>

<style scoped lang="scss">
.login {
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
.name-input {
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
.start-button {
  margin-top: 0.5rem;
  font-size: 1.5rem;
}
</style>
