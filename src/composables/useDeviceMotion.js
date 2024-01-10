import { Motion } from "@capacitor/motion";

export const useDeviceMotion = function () {
  let accelHandler;

  const { appStore } = useStores();

  const acceleration = reactive({ x: 0, y: 0, z: 0 });
  const alpha = ref(0);
  const beta = ref(0);
  const gamma = ref(0);

  const recordedData = ref([]);
  const isRecording = ref(false);
  const permissionGranted = ref(false);

  const requestPermission = async () => {
    try {
      if (permissionGranted.value) {
        return true;
      } else {
        await window.DeviceMotionEvent.requestPermission();
        permissionGranted.value = true;
      }
    } catch (e) {
      permissionGranted.value = false;
      console.error(`Permission not granted : ${e}`);
      return;
    }
  };

  const startRecording = async () => {
    isRecording.value = true;
    recordedData.value = [];
    accelHandler = await Motion.addListener("accel", (event) => {
      if (isRecording.value) {
        const {
          interval,
          acceleration: inAcceleration,
          accelerationIncludingGravity,
          rotationRate,
        } = event;
        const { x, y, z } = inAcceleration;

        acceleration.x = x;
        acceleration.y = y;
        acceleration.z = z;

        alpha.value = rotationRate.alpha;
        beta.value = rotationRate.beta;
        gamma.value = rotationRate.gamma;

        recordedData.value.push({
          interval,
          x,
          y,
          z,
          alpha: alpha.value,
          beta: beta.value,
          gamma: gamma.value,
        });
      }
    });
  };

  const stopRecording = () => {
    if (permissionGranted.value) {
      isRecording.value = false;
      Motion.removeAllListeners();

      const len = appStore.recordings.length;
      appStore.recordings.push({
        id: len,
        title: `Session ${len}`,
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
  };
};

export default useDeviceMotion;
