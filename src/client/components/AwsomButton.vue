<template>
  <button class="awsom-button">
    <slot />
  </button>
</template>
<style lang="scss" scoped>
.awsom-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid $primary-color;
  background-color: $primary-color;
  color: $white;
  appearance: none;
  text-align: center;
  outline: none;
  transition: 0.1s;
  font-weight: 500;
  user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  &:disabled {
    cursor: default;
    background: mix($white, $primary-color, 50%);
    border: 1px solid mix($white, $primary-color, 50%);
  }
  &:not(:disabled) {
    &:hover,
    &:focus {
      background: lighten($primary-color, 7%);
      border-color: lighten($primary-color, 9%);
    }
    &:active {
      background: darken($primary-color, 10%);
      border-color: darken($primary-color, 10%);
    }
  }
}
</style>
