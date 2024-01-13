<script setup>
const props = defineProps({
  copy: {
    default: "Go",
    type: String,
  },
});
</script>

<template>
  <button class="ui-cta-btn">
    <h2>{{ copy }}</h2>
  </button>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.ui-cta-btn
  grid-column: 2/16
  justify-self: flex-end
  width: 14rem
  height: 14rem
  background: $pink
  margin-bottom: 2rem
  padding-left: 0.4rem

  border-top-left-radius: 50%
  border-top-right-radius: 50%
  border-bottom-right-radius: 0%
  border-bottom-left-radius: 50%

  h2
    font-size: 2.4rem
    letter-spacing: 0.2em
</style>
