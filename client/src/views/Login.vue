<template>
  <transition name="login-fade">
    <div class="login-page">
      <img 
        alt="Vue logo" 
        src="../assets/logo.png"
      >
      <login/>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import Login from "@/components/Login.vue";

export default {
  components: {
    Login
  },
  computed: mapState({
    loginStage: state => state.login.stage
  }),
  watch: {
    loginStage(loginStage) {
      if (loginStage === "loggedIn") {
        this.$router.push("/");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login-page {
  background-color: $white;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  z-index: 1;
  text-align: center;
}
</style>