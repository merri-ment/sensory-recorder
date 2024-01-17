<script setup>
// const props = defineProps({
//   copy: {
//     default: "Go",
//     type: String,
//   },
// });
</script>

<template>
  <button class="ui-close-btn">
    <div class="line"></div>
    <div class="line"></div>
  </button>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.ui-close-btn
  width: 2rem
  height: 2rem
  position: relative

  .line
    width: 100%
    height: 3px
    position: absolute
    top: calc(50% - 1.5px)
    left: 0
    background: white

    &:nth-child(1)
      transform: rotate(45deg)

    &:nth-child(2)
      transform: rotate(-45deg)
</style>
