<template>
  <div v-if="activeModalName !== null" class="modal-manager">
    <div class="background-dim" @click="closeModal" />
    <awsom-card class="modal">
      <component :is="activeModal" v-bind="payload" />
      <awsom-button
        v-if="activeModal.modal.type === 'acknowledgement'"
        class="okay-button"
        >Okay</awsom-button
      >
      <div
        class="exit"
        tabindex="0"
        @keyup.enter="closeModal"
        @click="closeModal"
      >
        x
      </div>
    </awsom-card>
  </div>
</template>
<script>
// ---------Currently not in use---------
import { mapState, mapActions } from "vuex"
import AwsomCard from "./AwsomCard"
import AwsomButton from "./AwsomButton"
// import modals from "../modals";

export default {
  components: {
    AwsomCard,
    AwsomButton
  },
  // modals,
  computed: {
    ...mapState({
      activeModalName: state => state.modal.activeModal,
      payload: state => state.modal.payload
    })
    // activeModal() {
    //   return modals[this.activeModalName];
    // }
  },
  methods: mapActions(["closeModal"])
}
</script>

<style lang="scss" scoped>
.modal-manager {
  z-index: 999;
  .modal {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 10rem;
    top: 0;
    min-width: 300px;
    min-height: 100px;
    text-align: center;
    font-size: 1.2rem;
    .okay-button {
      position: absolute;
      display: inline-block;
      right: 0;
      bottom: 0;
      margin-right: 0.25rem;
      margin-bottom: 0.25rem;
    }
    .exit {
      font-size: 1rem;
      position: absolute;
      margin-right: 10px;
      margin-top: 5px;
      cursor: pointer;
      top: 0;
      right: 0;
    }
  }
}
.background-dim {
  position: fixed;
  background: rgba(0, 0, 0, 0.164);
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
}
</style>
