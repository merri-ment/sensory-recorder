<script setup>
import { MODAL_STATES } from "~/config/app";

const { appStore } = useStores();
const { modalState } = toRefs(appStore);

const show = ref(false);

watch(modalState, (val) => {
  show.value = val === MODAL_STATES.MENU;
});
</script>

<template>
  <div v-if="show" class="modal-menu"></div>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.modal-menu
  height: 100%
  width: 100%
  top: 0
  position: fixed
  +mainGrid()
  background: black
</style>
