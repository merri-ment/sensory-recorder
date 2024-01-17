<template>
  <Transition @enter="enter" :css="false" appear>
    <main ref="rootRef" class="session page">
      <div class="top">
        <AppTitle class="title" :small="true" v-html="data.title" />
      </div>
      <div class="content">
        <UiDropdown :selectedLabel="data.label" :labels="labels" />
        <UiDataPanel
          class="data-panel"
          :acceleration="acceleration"
          :alpha="alpha"
          :gamma="gamma"
          :beta="beta"
        />
      </div>

      <h2 class="timer">
        {{ formattedTime }}
      </h2>

      <h2 class="controls"></h2>
    </main>
  </Transition>
</template>

<script setup>
const route = useRoute();
const { appStore } = useStores();
const { labels } = toRefs(appStore);

const id = computed(() => route.params.slug);
const data = computed(() => appStore.getSessionById(Number(id.value)));
const formattedTime = computed(() => FormatTime(12));

const enter = (el, done) => {
  done();
};

onMounted(() => {});

onBeforeUnmount(() => {});
</script>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.session
  position: absolute
  width: 100vw
  height: 100vh

  .top
    +mainGrid
    position: absolute
    width: 100%
    height: 22rem
    align-items: end
    top: 0

  .content
    grid-column: 2/16
    padding-top: 25rem

    :deep(button)
      background-color: $blue


  .title
    color: $darkPink
    grid-column: 6/16
    margin-right: -1rem

  .data-panel
    color: $darkPink


  .timer
    grid-column: 2/12
    text-align: left
    align-self: flex-end
    justify-self: flex-start
    margin-bottom: 2rem
    color: $darkPink
    line-height: 14.5rem
    height: 14rem
    font-size: 4.5rem
    letter-spacing: 0.6rem
</style>
