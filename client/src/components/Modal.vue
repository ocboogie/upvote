<template>
  <div
    class="modal-container"
    :class="{ 'under-page-transition': underPageTransition }"
  >
    <div class="background-dim" @click="close" />
    <base-card class="modal">
      <slot />
      <base-button
        v-if="type === 'acknowledgement'"
        class="okay-button"
        @keyup.enter="close"
        @click.native="close"
      >
        Okay
      </base-button>
      <div
        v-if="type !== 'unclosable'"
        class="exit"
        tabindex="0"
        @keyup.enter="close"
        @click="close"
      >
        x
      </div>
    </base-card>
  </div>
</template>
<script>
export default {
  props: {
    type: { type: String, default: "base" },
    underPageTransition: { type: Boolean, default: false }
  },
  methods: {
    close() {
      if (this.type === "unclosable") {
        return
      }
      this.$emit("close")
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-container {
  &.under-page-transition {
    .background-dim {
      z-index: 8;
    }
    .modal {
      z-index: 9;
    }
  }
  .background-dim {
    z-index: 998;
    position: fixed;
    background: rgba(0, 0, 0, 0.164);
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
  }
  .modal {
    z-index: 999;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 10rem;
    top: 0;
    min-width: 300px;
    min-height: 100px;
    text-align: center;
    font-size: 1.2rem;
    padding: 1rem 1.5rem;
    .okay-button {
      margin-top: 1rem;
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
</style>
