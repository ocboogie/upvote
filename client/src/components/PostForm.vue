<template>
  <form @submit="submit">
    <awsom-input v-model="content" placeholder="Post content" />
    <awsom-button native-type="submit">Post</awsom-button>
  </form>
</template>
<script>
import { mapActions } from "vuex";
import AwsomInput from "./AwsomInput.vue";
import AwsomButton from "./AwsomButton.vue";

export default {
  components: {
    AwsomInput,
    AwsomButton
  },
  data: () => ({ content: "" }),
  methods: {
    ...mapActions(["post"]),
    submit(e) {
      e.preventDefault();
      if (!this.content) {
        return;
      }
      this.post(this.content);
      this.content = "";
    }
  }
};
</script>

<style lang="scss" scoped></style>
