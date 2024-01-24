<script setup>
import { IosSensors } from "@/capacitor/plugins/ios-sensors-plugin";

onMounted(async () => {
  await IosSensors.startDeviceMotion();
  IosSensors.addListener("update", (data) => console.log(data));
});
</script>

<template>
  <div>
    <WebGL />
    <NuxtPage />
    <ModalMenu />
    <AppHeader />
  </div>
</template>

<style lang="sass">
@import "@/styles/shared.sass"
@import "@/styles/normalize.sass"
@import "@/styles/base.sass"

#app
  +full()
  position: absolute
</style>
