<script setup>
import { MODAL_STATES } from "@/config/app";
const { appStore } = useStores();
const show = computed(() => appStore.modalState === MODAL_STATES.DOWNLOADING);
</script>

<template>
  <div v-if="show" class="modal-download">
    <div class="top">
      <AppTitle :small="true" class="title">
        Down
        <br />
        loading
      </AppTitle>
    </div>
    <div class="bottom">
      <div class="loader ui-cta-btn"></div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.modal-download
  +mainGrid()
  height: 100vh
  width: 100vw
  top: 0
  position: fixed
  background: $pink
  z-index: 20

  .top
    +mainGrid
    position: absolute
    width: 100%
    height: 22rem
    align-items: end
    top: 0
    color: #B35695

  .bottom
    +mainGrid
    bottom: 0
    left: 0
    width: 100%
    position: fixed
    height: 12rem

  .ui-cta-btn
    grid-column: 2/16
    justify-self: flex-end
    width: 8rem
    height: 8rem
    background: $pink
    margin-bottom: 0rem
    padding-left: 0.4rem


  .title
    grid-column: 2/16
    margin-right: -1rem
</style>
