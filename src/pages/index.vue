<script setup>
import { HOME_STATE } from "@/config/app";

const {
  requestPermission,
  startRecording,
  stopRecording,
  isRecording,
  acceleration,
  alpha,
  beta,
  gamma,
  time,
  title,
} = useDeviceMotion();

const { appStore } = useStores();
const router = useRouter();
const state = ref(HOME_STATE.UNSET);

const { labels } = toRefs(appStore);

const formattedTime = computed(() => {
  return FormatTime(time.value);
});

const enter = (el, done) => {
  state.value = HOME_STATE.LANDING;
  done();
};

const leave = (el, done) => {
  done();
};

const onGoClick = () => {
  state.value = HOME_STATE.ASSIGN_LABEL;
};

const onRecordClick = async () => {
  await requestPermission();
  await startRecording();
  state.value = HOME_STATE.RECORDING;
};

const onStopRecordClick = () => {
  stopRecording();
  router.push("recordings");
};

const onAdded = (value) => {
  appStore.labels.push(value);
};
</script>

<template>
  <Transition @enter="enter" @leave="leave" appear :css="false">
    <main class="home page">
      <div class="top">
        <AppTitle v-if="state === HOME_STATE.LANDING">
          Gyro
          <br />
          Graph
        </AppTitle>
        <AppTitle :small="true" v-if="state === HOME_STATE.ASSIGN_LABEL">
          Assign
          <br />
          Data Label
        </AppTitle>

        <div class="recording" v-if="state === HOME_STATE.RECORDING">
          <AppTitle :small="true" v-html="title" />
          <UiDataPanel
            class="data-panel"
            :acceleration="acceleration"
            :alpha="alpha"
            :gamma="gamma"
            :beta="beta"
          />
        </div>
      </div>

      <IconsLogo v-if="state === HOME_STATE.LANDING" />
      <UiDropdown
        v-if="state === HOME_STATE.ASSIGN_LABEL"
        @added="onAdded"
        :labels="labels"
      />
      <h2 v-if="state === HOME_STATE.RECORDING" class="timer">
        {{ formattedTime }}
      </h2>

      <p class="assign-label-desc" v-if="state === HOME_STATE.ASSIGN_LABEL">
        Before we start,
        <br />
        Create a label to assign the data we will be collecting from the motion
        sensors.
      </p>

      <div class="layout-btn-wrap">
        <UiCtaButton
          v-if="state === HOME_STATE.LANDING"
          @click="onGoClick"
          :copy="`LETS GO`"
        />
        <UiCtaButton
          v-if="state === HOME_STATE.ASSIGN_LABEL"
          @click="onRecordClick"
          :copy="`RECORD`"
        />
        <UiCtaButton
          v-if="state === HOME_STATE.RECORDING"
          @click="onStopRecordClick"
          :copy="`STOP`"
        />
      </div>
    </main>
  </Transition>
</template>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

main
  // background: $blueGradient
  position: absolute
  width: 100vw
  height: 100vh

  .assign-label-desc
    grid-column: 3/12
    position: absolute
    align-self: center
    margin-top: 18rem

  .title
    grid-column: 2/16
    margin-right: -1rem

  .timer
    grid-column: 2/12
    text-align: left
    align-self: flex-end
    justify-self: flex-start
    margin-bottom: 2rem
    color: $white
    line-height: 14.5rem
    height: 14rem
    font-size: 4.5rem
    letter-spacing: 0.6rem

  .top
    +mainGrid
    position: absolute
    width: 100%
    height: 22rem
    align-items: end

    .recording
      grid-column: 2/16
      position: relative

      .data-panel
        position: absolute
        top: 0



.start
  position: absolute
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
</style>
