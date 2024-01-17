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

const route = useRoute();
const showHamburger = computed(() => {
  return ["index", "recordings"].includes(route.name);
});
</script>

<template>
  <nav class="app-header">
    <Hamburger v-if="showHamburger" />
    <NuxtLink class="back-btn" v-if="!showHamburger" to="/recordings">
      <h2>back</h2>
    </NuxtLink>
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

  .back-btn
    width: 100%
    position: relative
    top: 0
    left: 0
    align-self: flex-end
    grid-column: 2/5

    h2
      position: relative

      &::after
        width: 100%
        height: 3px
        content: ''
        background: white
        position: absolute
        bottom: 3rem
</style>
