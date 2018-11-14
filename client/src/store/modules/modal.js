export default {
  state: {
    activeModal: null,
    payload: {}
  },
  mutations: {
    setActiveModal(state, activeModal) {
      state.activeModal = activeModal
    },
    setPayload(state, payload) {
      state.payload = payload
    }
  },
  actions: {
    openModal(context, modal, payload) {
      context.commit("setActiveModal", modal)
      context.commit("setPayload", payload)
    },
    closeModal(context) {
      context.commit("setActiveModal", null)
      context.commit("setPayload", {})
    }
  }
}
