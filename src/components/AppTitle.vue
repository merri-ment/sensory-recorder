<script setup>
const props = defineProps({
  copy: {
    default: "Go",
    type: String,
  },
  small: {
    default: false,
    type: Boolean,
  },
});
</script>

<template>
  <h2 class="app-title title" :class="{ small }">
    <slot />
  </h2>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"
</style>
