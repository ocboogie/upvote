<template>
  <div>
    <avatar
      ref="avatar"
      class="avatar-editor"
      editable
      :color="selectedColor"
    />
    <div class="colors">
      <div
        v-for="color in colors"
        :key="color"
        class="color"
        :style="{ backgroundColor: color }"
        @click="changeColor(color)"
      />
    </div>
    <base-button class="random" @click.native="randomize">Random</base-button>
  </div>
</template>
<script>
import Avatar from "./Avatar.vue"

const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#e74c3c"]

export default {
  components: {
    Avatar
  },
  data: () => ({
    colors,
    selectedColor: colors[Math.floor(Math.random() * colors.length)]
  }),
  methods: {
    changeColor(color) {
      this.selectedColor = color
    },
    randomize() {
      this.$refs.avatar.randomize()
    },
    intoData() {
      return this.$refs.avatar.intoData()
    }
  }
}
</script>
<style lang="scss" scoped>
.colors {
  margin: 0 5px;
  .color {
    display: inline-block;
    margin: 0 10px 10px 0;
    vertical-align: top;
    cursor: pointer;
    width: 16px;
    height: 16px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
    border-radius: 3px;

    display: inline-block;
    &:last-child {
      margin: 0;
    }
  }
}
.random {
  width: 100%;
}
</style>
