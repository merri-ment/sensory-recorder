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
    <main class="manage-labels page"></main>
  </Transition>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.manage-labels
  position: absolute
  width: 100vw
  height: 100vh
</style>
