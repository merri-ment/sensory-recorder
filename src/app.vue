<script setup></script>

<template>
  <div>
    <WebGL />
    <NuxtPage />
    <ModalMenu />
    <AppHeader />
    <ModalDownload />
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
