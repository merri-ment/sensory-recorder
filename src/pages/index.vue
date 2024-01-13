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
} = useDeviceMotion();

const router = useRouter();
const state = ref(HOME_STATE.UNSET);

const enter = (el, done) => {
  state.value = HOME_STATE.LANDING;
  done();
};

const leave = (el, done) => {
  done();
};

const onRecordClick = async () => {
  await requestPermission();
  await startRecording();
  state.value = HOME_STATE.ASSIGN_LABEL;
};

const onStopRecordClick = () => {
  stopRecording();
  router.push("recordings");
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
      </div>

      <IconsLogo v-if="state === HOME_STATE.LANDING" />

      <UiDropdown v-if="state === HOME_STATE.ASSIGN_LABEL" />

      <p class="assign-label-desc" v-if="state === HOME_STATE.ASSIGN_LABEL">
        Before we start,
        <br />
        Create a label to assign the data we will be collecting from the motion
        sensors.
      </p>

      <div class="data" v-if="state === HOME_STATE.RECORDING">
        <div>
          <p>x {{ acceleration.x }}</p>
          <p>y {{ acceleration.y }}</p>
          <p>z {{ acceleration.z }}</p>
        </div>
        <div>
          <p>alpha {{ alpha }}</p>
        </div>
        <div>
          <p>beta {{ beta }}</p>
        </div>
        <div>
          <p>gamma {{ gamma }}</p>
        </div>
      </div>

      <div class="layout-btn-wrap">
        <UiCtaButton
          v-if="state === HOME_STATE.LANDING"
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
  background: linear-gradient(180deg, #62d9ff 0%, #90e4ff 100%)
  position: absolute
  width: 100vw
  height: 100vh

  .assign-label-desc
    grid-column: 3/12
    position: absolute
    align-self: center
    margin-top: 35rem

  .title
    grid-column: 2/16
    margin-right: -1rem

  .top
    +mainGrid
    position: absolute
    width: 100%
    height: 22rem
    align-items: end

.start
  position: absolute
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
</style>
