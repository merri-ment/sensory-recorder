import { IosSensors } from "@/capacitor/plugins/ios-sensors-plugin";

export const useDeviceMotion = () => {
  const { appStore } = useStores();

  const title = computed(
    () => `session <br/> ${NumberToWord(appStore.sessions.length)}`
  );

  const accelerometer = reactive({ x: 0, y: 0, z: 0 });
  const magnetometer = reactive({ x: 0, y: 0, z: 0 });
  const gyroscope = reactive({ x: 0, y: 0, z: 0 });
  const altimeter = reactive({ pressure: 0, relativeAltitude: 0 });
  const location = reactive({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    course: 0,
  });

  const elapsedTime = ref(0);
  const interval = ref(0);
  const label = ref("");
  const recordedData = ref([]);
  const isRecording = ref(false);
  const permissionGranted = ref(false);
  let listener = null;

  const requestPermission = async () => {
    try {
      if (!permissionGranted.value) {
        await IosSensors.startDeviceMotion();
        permissionGranted.value = true;
      }
      return true;
    } catch (e) {
      permissionGranted.value = false;
      console.error(e);
      return false;
    }
  };

  const onSensorUpdate = (e) => {
    if (!isRecording.value) return;

    updateReactiveState(accelerometer, e.accelerometer);
    updateReactiveState(magnetometer, e.magnetometer);
    updateReactiveState(gyroscope, e.gyroscope);
    updateReactiveState(location, e.location);
    updateReactiveState(altimeter, e.altitude);

    elapsedTime.value = e.elapsedTime;
    interval.value = e.interval;

    recordedData.value.push({
      elapsedTime: elapsedTime.value,
      interval: interval.value,
      ax: accelerometer.x,
      ay: accelerometer.y,
      az: accelerometer.z,
      mx: magnetometer.x,
      my: magnetometer.y,
      mz: magnetometer.z,
      gx: gyroscope.x,
      gy: gyroscope.y,
      gz: gyroscope.z,
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      speed: location.speed,
      course: location.course,
      pressure: altimeter.pressure,
      relativeAltitude: altimeter.relativeAltitude,
    });
  };

  const updateReactiveState = (reactiveState, data) => {
    for (const key in data) {
      reactiveState[key] = data[key];
    }
  };

  const startRecording = async () => {
    if (!(await requestPermission())) return;
    isRecording.value = true;
    recordedData.value = [];
    listener = await IosSensors.addListener("update", onSensorUpdate);
  };

  const stopRecording = () => {
    isRecording.value = false;

    const session = {
      id: appStore.sessions.length,
      label: label.value,
      time: elapsedTime.value,
      title: title.value,
      data: recordedData.value,
    };
    appStore.sessions.unshift(session);

    IosSensors.stop();
    listener?.remove();
  };

  return {
    startRecording,
    stopRecording,

    recordedData,
    isRecording,

    requestPermission,
    permissionGranted,

    title,
    label,

    elapsedTime,
    interval,

    accelerometer,
    magnetometer,
    gyroscope,
    location,
    altimeter,
  };
};

export default useDeviceMotion;
