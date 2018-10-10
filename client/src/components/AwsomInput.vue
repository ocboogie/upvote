<template>
  <input 
    :value="value" 
    class="awsom-input" 
    @input="$emit('input', $event.target.value)"
  >
</template>
<script>
export default {
  props: { value: { type: String, default: "" } }
};
</script>

<style lang="scss" scoped>
.awsom-input {
  border-radius: 4px;
  border: 1px solid $border-base-color;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  font-size: 14px;
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
