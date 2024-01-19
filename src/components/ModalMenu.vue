<script setup>
import { MODAL_STATES } from "@/config/app";

const { appStore } = useStores();
const route = useRoute();

const show = computed(() => appStore.modalState === MODAL_STATES.MENU);
const onClick = () => {
  appStore.modalState = MODAL_STATES.NONE;
};
</script>

<template>
  <div v-if="show" class="modal-menu">
    <div class="top">
      <AppTitle>
        Gyro
        <br />
        Graph
      </AppTitle>
    </div>
    <ul>
      <li>
        <NuxtLink to="/" @click="onClick">
          <h2>Home</h2>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about" @click="onClick">
          <h2>About</h2>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/manage-labels" @click="onClick">
          <h2>Manage Labels</h2>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/recordings" @click="onClick">
          <h2>Recordings</h2>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.modal-menu
  +mainGrid()
  height: 100vh
  width: 100vw
  top: 0
  position: fixed
  background: $pink
  z-index: 2

  .top
    +mainGrid
    position: absolute
    width: 100%
    height: 22rem
    align-items: end
    top: 0

  .title
    grid-column: 2/16
    margin-right: -1rem

  ul
    margin-top: 30rem
    grid-column: 2/16

    li
      margin-bottom: 4rem

      h2
        position: relative
        display: inline
        font-size: 3rem

        &::after
          width: 100%
          height: 3px
          content: ''
          background: white
          position: absolute
          bottom: 0
          left: 0
</style>
