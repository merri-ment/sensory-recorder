<script setup>
import { HOME_STATE, MODAL_STATES } from "@/config/app";

const { appStore } = useStores();
const { sessions } = toRefs(appStore);

const enter = (el, done) => {
  done();
};
const leave = (el, done) => {
  done();
};

const onDownload = async () => {
  appStore.modalState = MODAL_STATES.DOWNLOADING;
  await PromiseTimeout(100);
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
          <NuxtLink :to="`/session/${session.id}`">
            <h2>
              {{ session.num }} - {{ session.label }} -
              {{ FormatTime(session.time) }}
            </h2>
            <UiCloseButton />
          </NuxtLink>
        </li>
      </ul>
      <div class="bottom">
        <NuxtLink :to="`/?state=${HOME_STATE.ASSIGN_LABEL}`">
          <h2>NEW SESSION</h2>
        </NuxtLink>
        <UiCtaButton
          class="btn"
          :copy="`Download dataset`"
          @click="onDownload"
        />
      </div>
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
      margin-bottom: 1rem

      a
        height: 100%
        width: 100%
        display: flex
        align-items: center
        padding: 0 1.5rem
        justify-content: space-between

      h2
        font-size: 1.8rem


  .btn
    background: white
    color: $pink
    align-self: flex-end
    z-index: 1

    :deep(h2)
      font-size: 2rem
      letter-spacing: 0.1em

  .title
    color: $darkPink
    grid-column: 2/16
    margin-right: -1rem

  .bottom
    +mainGrid
    bottom: 0
    left: 0
    width: 100%
    position: fixed
    height: 20rem
    z-index: 1
    background: linear-gradient(to bottom,  rgba(255, 98, 183,0) 0%,rgba(255, 98, 183,1) 40%)

    a
      grid-column: 2/10
      bottom: 7.75rem
      position: absolute

      h2
        position: relative
        display: inline
        font-size: 2.2rem

        &::after
          width: 100%
          height: 3px
          content: ''
          background: white
          position: absolute
          bottom: 0
          left: 0


  .home
    top: 100px
    left: 10px
</style>
