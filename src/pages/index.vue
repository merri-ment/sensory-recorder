<script setup>
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

const enter = (el, done) => {
  done();
};
const leave = (el, done) => {
  done();
};

const onRecordClick = async () => {
  await requestPermission();
  await startRecording();
};

const onStopRecordClick = () => {
  stopRecording();
  router.push("recordings");
};
</script>

<template>
  <Transition @enter="enter" @leave="leave" appear :css="false">
    <main class="home">
      <div class="data" v-if="isRecording">
        <div>
          <p>x : {{ acceleration.x }}</p>
          <p>y : {{ acceleration.y }}</p>
          <p>z : {{ acceleration.z }}</p>
        </div>
        <div>
          <p>alpha : {{ alpha }}</p>
        </div>
        <div>
          <p>beta : {{ beta }}</p>
        </div>
        <div>
          <p>gamma : {{ gamma }}</p>
        </div>
      </div>

      <div class="start" v-if="!isRecording">
        <button @click="onRecordClick">Start</button>
      </div>
      <div class="stop" v-if="isRecording">
        <button @click="onStopRecordClick">Stop</button>
      </div>
    </main>
  </Transition>
</template>

<style scoped>
/* html,
body {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
} */

main {
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.start {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
