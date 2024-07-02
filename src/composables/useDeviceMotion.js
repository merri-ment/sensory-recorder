import { IosSensors } from "@/capacitor/plugins/ios-sensors-plugin";
import { LABELS } from "@/config/app";

const countMap = {};
LABELS.forEach((label) => (countMap[label] = 0));

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
    // await IosSensors.startDeviceMotion();
    /* try {
      if (!permissionGranted.value) {
        permissionGranted.value = true;
      }
      return true;
    } catch (e) {
      permissionGranted.value = false;
      console.error(e);
      return false;
    } */
  };

  const onSensorUpdate = (e) => {
    console.log(e);

    if (!isRecording.value) {
      console.log("no isRecording value");
      return;
    }

    if (!e.accelerometer) {
      console.log("no accelerometer data");
    } else {
      accelerometer.x = e.accelerometer.x;
      accelerometer.y = e.accelerometer.y;
      accelerometer.z = e.accelerometer.z;
    }

    if (!e.magnetometer) {
      console.log("no magnetometer data");
    } else {
      magnetometer.x = e.magnetometer.x;
      magnetometer.y = e.magnetometer.y;
      magnetometer.z = e.magnetometer.z;
    }

    if (!e.gyroscope) {
      console.log("no gyroscope data");
    } else {
      gyroscope.x = e.gyroscope.x;
      gyroscope.y = e.gyroscope.y;
      gyroscope.z = e.gyroscope.z;
    }

    if (!e.location) {
      console.log("no location data");
    } else {
      location.altitude = e.location.altitude;
      location.latitude = e.location.latitude;
      location.longitude = e.location.longitude;
      location.speed = e.location.speed;
      location.course = e.location.course;
    }

    if (!e.altimeter) {
      console.log("no altitude data");
    } else {
      altimeter.pressure = e.altimeter.pressure;
      altimeter.relativeAltitude = e.altimeter.relativeAltitude;
    }

    if (e.elapsedTime) {
      elapsedTime.value = e.elapsedTime;
    } else {
      console.log(e);
    }

    interval.value = e.interval;

    if (elapsedTime.value > 0) {
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
    }
  };

  const startRecording = async () => {
    listener = await IosSensors.addListener("update", onSensorUpdate);
    await IosSensors.startDeviceMotion();
    isRecording.value = true;
    recordedData.value = [];
  };

  const stopRecording = () => {
    isRecording.value = false;
    countMap[label.value]++;
    const session = {
      num: countMap[label.value],
      id: appStore.sessions.length,
      label: label.value,
      time: elapsedTime.value,
      title: title.value,
      data: recordedData.value,
    };
    appStore.sessions.unshift(session);

    IosSensors.stopDeviceMotion();
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
