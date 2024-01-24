<template>
  <div class="ui-data-panel">
    <p>
      x {{ acceleration.x }}<br />
      y {{ acceleration.y }}<br />
      z {{ acceleration.z }}
    </p>
    <p>
      mx {{ magneticField.x }}<br />
      my {{ magneticField.y }}<br />
      mz {{ magneticField.z }}
    </p>
    <p>
      alpha {{ rotationRate.alpha }}<br />
      beta {{ rotationRate.beta }}<br />
      gamma {{ rotationRate.gamma }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  acceleration: {
    default: () => ({ x: 0, y: 0, z: 0 }),
    type: Object,
  },
  rotationRate: {
    default: () => ({ x: 0, y: 0, z: 0 }),
    type: Object,
  },
  magneticField: {
    default: () => ({ x: 0, y: 0, z: 0 }),
    type: Object,
  },
});
</script>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.ui-data-panel
  grid-column: 2/10
  opacity: 0.5

  p
    line-height: 1.8
    margin-top: 0
</style>
