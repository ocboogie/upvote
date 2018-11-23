<template>
  <input
    :value="value"
    class="base-input"
    @input="$emit('input', $event.target.value)"
  />
</template>
<script>
export default {
  props: { value: { type: String, default: "" } }
}
</script>

<style lang="scss" scoped>
.base-input {
  border-radius: 4px;
  border: 1px solid $border-base-color;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: auto;
  padding: 12px 15px;
  &::placeholder {
    color: $text-placeholder-color;
  }

  &:hover {
    border-color: $text-placeholder-color;
  }

  &:focus {
    outline: none;
    border-color: $primary-color;
  }

  &.is-error {
    border-color: $error-color;
  }
}
</style>
