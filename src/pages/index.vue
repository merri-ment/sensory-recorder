<script setup>
import { HOME_STATE, UI_TYPE } from "@/config/app";

const {
  requestPermission,
  startRecording,
  stopRecording,

  elapsedTime,
  title,
  label,

  accelerometer,
  gyroscope,
  magnetometer,
  location,
} = useDeviceMotion();

const { appStore } = useStores();
const router = useRouter();
const route = useRoute();
const state = ref(HOME_STATE.UNSET);

const text = ref("Select a label from the following options, ");
const { speak } = useTextToSpeech({ text, state });

const {
  isSupported: speechRecognitionSupported,
  isListening,
  isFinal,
  result,
  start,
  stop: speechRecognitionStop,
} = useSpeechRecognition({
  lang: "en-US",
  continuous: true,
  interimResults: false,
});

const { labels } = toRefs(appStore);
label.value = labels.value[0];

const formattedTime = computed(() => {
  return FormatTime(elapsedTime.value);
});

const enter = (el, done) => {
  state.value = route.query.state || HOME_STATE.LANDING;
  done();
};

const leave = (el, done) => {
  done();
};

const onGoClick = async () => {
  state.value = HOME_STATE.ASSIGN_LABEL;

  if (appStore.ui === UI_TYPE.VOICE) {
    try {
      labels.value.forEach((val) => (text.value += `${val}. `));
      text.value += ", or say,  New Label.";
      // utterance.value.addEventListener("end", function () {
      //   console.log("stopped");
      // record();
      // });
      speak.value();
    } catch (e) {
      console.log(e);
    }
  }
};

const onRecordClick = async () => {
  state.value = HOME_STATE.RECORDING;
  record();
};

const record = async () => {
  // await requestPermission();
  await startRecording();
};

const onStopRecordClick = () => {
  stopRecording();
  router.push("recordings");
};

const onLabelAdded = (value) => {
  appStore.labels.push(value);
  label.value = value;
};

const onLabelChange = (value) => {
  label.value = value;
};
</script>

<template>
  <Transition @enter="enter" @leave="leave" appear :css="false">
    <main class="home page">
      <div class="top">
        <!-- <h2 class="timer">
          {{ location.longitude }}
        </h2>
        <h2 class="timer">
          {{ location.latitude }}
        </h2>
        <h2 class="timer">
          {{ location.altitude }}
        </h2> -->

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
            :acceleration="accelerometer"
            :rotationRate="gyroscope"
            :magneticField="magnetometer"
          />
        </div>
      </div>

      <IconsLogo v-if="state === HOME_STATE.LANDING" />
      <UiDropdown
        v-if="state === HOME_STATE.ASSIGN_LABEL"
        @added="onLabelAdded"
        @selected="onLabelChange"
        :selectedLabel="labels[0]"
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
