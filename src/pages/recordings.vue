<script setup>
const { appStore } = useStores();
const { sessions } = toRefs(appStore);

const enter = (el, done) => {
  done();
  console.log(appStore);
};
const leave = (el, done) => {
  done();
};

const onDownload = () => {
  appStore.exportToCSV();
};
</script>

<template>
  <Transition @enter="enter" @leave="leave" appear :css="false">
    <main class="recordings page">
      <NuxtLink class="home" to="/">Home</NuxtLink>
      <div class="top">
        <AppTitle :small="true" class="title">
          your
          <br />
          recordings
        </AppTitle>
      </div>
      <ul>
        <li v-for="(session, index) in sessions" :key="index">
          <h2>{{ session.title }} - {{ session.time }}</h2>
        </li>
      </ul>
      <UiCtaButton class="btn" :copy="`Download dataset`" @click="onDownload" />
    </main>
  </Transition>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

main
  position: absolute
  width: 100vw
  height: 100vh
  overflow: hidden
  background-color: $pink

  .top
    +mainGrid
    position: absolute
    width: 100%
    height: 22rem
    align-items: end
    top: 0

  ul
    grid-column: 3/15
    margin-top: 26rem
    height: calc(100vh - 26rem)
    overflow: scroll
    padding: 0 0 20rem

    &::before
      position: absolute
      content: " "
      bottom: 0
      width: 100%
      height: 15rem
      z-index: 1
      background: linear-gradient(to bottom,  rgba(255, 98, 183,0) 0%,rgba(255, 98, 183,1) 100%)


    li
      height: 5rem
      width: 100%
      background: $blue
      display: flex
      margin-bottom: 1rem
      align-items: center
      padding: 0 2rem

  .btn
    background: white
    color: #FF62B7
    align-self: flex-end
    position: absolute
    z-index: 1

    :deep(h2)
      font-size: 2rem
      letter-spacing: 0.1em

  .title
    color: $darkPink
    grid-column: 2/16
    margin-right: -1rem

  .home
    top: 100px
    left: 10px
</style>
