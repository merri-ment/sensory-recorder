<template>
  <div class="ui-data-panel">
    <p>
      x {{ acceleration.x }}<br />
      y {{ acceleration.y }}<br />
      z {{ acceleration.z }}
    </p>
    <p>
      alpha {{ alpha }}<br />
      beta {{ beta }}<br />
      gamma {{ gamma }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  acceleration: {
    default: () => ({ x: 0, y: 0, z: 0 }),
    type: Object,
  },
  alpha: {
    default: 0,
    type: Number,
  },
  beta: {
    default: 0,
    type: Number,
  },
  gamma: {
    default: 0,
    type: Number,
  },
});
</script>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.ui-data-panel
  grid-column: 2/10

  p
    line-height: 2.2
    margin-top: 0
</style>
