<script setup>
const { appStore } = useStores();
const { sessions } = toRefs(appStore);

const enter = (el, done) => {
  done();
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
      <div class="top">
        <AppTitle :small="true" class="title">
          your
          <br />
          recordings
        </AppTitle>
      </div>
      <ul>
        <li v-for="(session, index) in sessions" :key="index">
          <h2>{{ session.title }} - {{ FormatTime(session.time) }}</h2>
          <UiCloseButton />
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
  overflow: scroll
  background-color: $pink

  &::before
    position: fixed
    content: " "
    bottom: 0
    width: 100%
    height: 20rem
    z-index: 1
    background: linear-gradient(to bottom,  rgba(255, 98, 183,0) 0%,rgba(255, 98, 183,1) 100%)

  .top
    +mainGrid
    position: absolute
    width: 100%
    height: 22rem
    align-items: end
    top: 0

  ul
    grid-column: 4/16
    margin-top: 26rem
    padding: 0 0 20rem

    li
      height: 5rem
      width: 100%
      background: $blue
      display: flex
      margin-bottom: 1rem
      align-items: center
      padding: 0.2rem 1.5rem 0
      justify-content: space-between

      h2
        font-size: 1.8rem


  .btn
    background: white
    color: $pink
    align-self: flex-end
    position: fixed
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
