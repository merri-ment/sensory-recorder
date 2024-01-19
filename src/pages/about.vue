<script setup>
const { appStore } = useStores();

const enter = (el, done) => {
  done();
};
const leave = (el, done) => {
  done();
};
</script>

<template>
  <Transition @enter="enter" @leave="leave" appear :css="false">
    <main class="about page"></main>
  </Transition>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

main
  position: absolute
  width: 100vw
  height: 100vh
  overflow: scroll
</style>
