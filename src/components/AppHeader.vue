<script setup>
/* const props = defineProps({
  copy: {
    default: "Go",
    type: String,
  },
  small: {
    default: false,
    type: Boolean,
  },
}); */
</script>

<template>
  <nav class="app-header">
    <Hamburger />
  </nav>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.app-header
  height: 7.5rem
  width: 100%
  top: 0
  position: fixed
  +mainGrid()
</style>
