<template>
  <modal v-if="activeModal" :type="activeModal.modal.type" @close="closeModal">
    <component :is="activeModal" v-bind="payload" />
  </modal>
</template>
<script>
import { mapState, mapActions } from "vuex"
import modals from "../modals"
import Modal from "./Modal.vue"

export default {
  components: {
    Modal
  },
  computed: {
    ...mapState({
      activeModalName: state => state.modal.activeModal,
      payload: state => state.modal.payload
    }),
    activeModal() {
      return modals[this.activeModalName]
    }
  },
  methods: mapActions(["closeModal"])
}
</script>
