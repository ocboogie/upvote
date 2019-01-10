<template>
  <transition name="fade" :duration="5350">
    <div
      class="modal-container"
      :class="{ 'under-page-transition': underPageTransition }"
    >
      <div class="background-dim" @click="close" />
      <div class="modal">
        <base-card class="modal-content">
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
    </div>
  </transition>
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
.fade-enter-active,
.fade-leave-active {
  .modal {
    transition: transform 0.15s cubic-bezier(0, 0, 0.3, 1), opacity 0.05s linear;
  }
  .background-dim {
    transition: opacity 0.1s linear;
  }
}

.fade-enter,
.fade-leave-to {
  .modal {
    transform: translateY(50px);
    opacity: 0;
  }
  .background-dim {
    opacity: 0;
  }
}

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
    margin-top: 5rem;
    overflow-x: hidden;
    overflow-y: auto;

    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .modal-content {
      max-width: 500px;
      min-width: 300px;
      min-height: 100px;
      text-align: center;
      font-size: 1.2rem;
      padding: 1rem 1.5rem;

      margin: auto;
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
}
</style>
