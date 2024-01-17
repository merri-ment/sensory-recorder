import { Motion } from "@capacitor/motion";

export const useDeviceMotion = function () {
  let accelHandler;

  const { appStore } = useStores();
  const title = computed(
    () => `session <br/> ${NumberToWord(appStore.sessions.length)}`
  );
  const acceleration = reactive({ x: 0, y: 0, z: 0 });
  const alpha = ref(0);
  const beta = ref(0);
  const gamma = ref(0);
  const time = ref(0);

  const recordedData = ref([]);
  const isRecording = ref(false);
  const permissionGranted = ref(false);

  const requestPermission = async () => {
    try {
      if (permissionGranted.value) {
        return true;
      } else {
        await DeviceMotionEvent.requestPermission();
        permissionGranted.value = true;
      }
    } catch (e) {
      permissionGranted.value = false;
      console.error(`Permission not granted : ${e}`);
      return;
    }
  };

  const update = (event) => {
    if (isRecording.value) {
      const {
        interval,
        acceleration: inAcceleration,
        accelerationIncludingGravity,
        rotationRate,
      } = event;
      const { x, y, z } = inAcceleration;

      acceleration.x = TruncateNumber(x, 3);
      acceleration.y = TruncateNumber(y, 3);
      acceleration.z = TruncateNumber(z, 3);

      time.value += interval;

      alpha.value = TruncateNumber(rotationRate.alpha, 3);
      beta.value = TruncateNumber(rotationRate.beta, 3);
      gamma.value = TruncateNumber(rotationRate.gamma, 3);

      recordedData.value.push({
        i: interval,
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z,
        a: alpha.value,
        b: beta.value,
        g: gamma.value,
      });
    }
  };

  const startRecording = async () => {
    isRecording.value = true;
    recordedData.value = [];
    accelHandler = await Motion.addListener("accel", update);
  };

  const stopRecording = () => {
    if (permissionGranted.value) {
      isRecording.value = false;
      Motion.removeAllListeners();

      const len = appStore.sessions.length;
      appStore.sessions.push({
        id: len,
        title: title.value,
        time: time.value,
        data: recordedData.value,
      });
      if (accelHandler) {
        accelHandler.remove();
      }
    } else {
      console.warn("Permission not granted : call requestPermission() first");
    }
  };

  return {
    requestPermission,

    startRecording,
    stopRecording,

    recordedData,
    isRecording,
    permissionGranted,

    acceleration,
    alpha,
    beta,
    gamma,
    title,
    time,
  };
};

export default useDeviceMotion;
