<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <awsom-button>Start</awsom-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AwsomInput from "@/components//AwsomInput.vue";
import AwsomButton from "@/components/AwsomButton.vue";

export default {
  components: {
    AwsomInput,
    AwsomButton
  },
  computed: mapState({
    userStage: state => state.user.stage
  })
};
</script>
<style lang="scss" scoped>
.lobby {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid $border-lighter-color;
  background-color: $white;
  overflow: hidden;
  color: $text-primary-color;

  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding-bottom: 1rem;
  h1 {
    font-weight: 300;
  }
}
</style>