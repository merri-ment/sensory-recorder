// import { Motion } from "@capacitor/motion";
import { IosSensors } from "@/capacitor/plugins/ios-sensors-plugin";

export const useDeviceMotion = function () {
  const { appStore } = useStores();

  const title = computed(
    () => `session <br/> ${NumberToWord(appStore.sessions.length)}`
  );
  const rawAcceleration = reactive({ x: 0, y: 0, z: 0 });
  const rawMagneticField = reactive({ x: 0, y: 0, z: 0 });
  const rawRotationRate = reactive({ x: 0, y: 0, z: 0 });

  const filteredAcceleration = reactive({ x: 0, y: 0, z: 0 });
  const filteredMagneticField = reactive({ x: 0, y: 0, z: 0 });
  const filteredRotationRate = reactive({ x: 0, y: 0, z: 0 });

  const elapsedTime = ref(0); // total time
  const interval = ref(0); // time delta
  const label = ref("");

  const recordedData = ref([]);
  const isRecording = ref(false);
  const permissionGranted = ref(false);

  let listener = null;

  const requestPermission = async () => {
    try {
      if (permissionGranted.value) {
        return true;
      } else {
        await IosSensors.startDeviceMotion();
        permissionGranted.value = true;
      }
    } catch (e) {
      permissionGranted.value = false;
      console.error(e);
      return;
    }
  };

  const update = (event) => {
    if (isRecording.value) {
      const { filtered, raw } = event;

      filteredAcceleration.x = filtered.accelerometer.x;
      filteredAcceleration.y = filtered.accelerometer.y;
      filteredAcceleration.z = filtered.accelerometer.z;
      filteredMagneticField.x = filtered.magnetometer.x;
      filteredMagneticField.y = filtered.magnetometer.y;
      filteredMagneticField.z = filtered.magnetometer.z;
      filteredRotationRate.x = filtered.gyroscope.x;
      filteredRotationRate.y = filtered.gyroscope.y;
      filteredRotationRate.z = filtered.gyroscope.z;

      rawAcceleration.x = raw.accelerometer.x;
      rawAcceleration.y = raw.accelerometer.y;
      rawAcceleration.z = raw.accelerometer.z;
      rawMagneticField.x = raw.magnetometer.x;
      rawMagneticField.y = raw.magnetometer.y;
      rawMagneticField.z = raw.magnetometer.z;
      rawRotationRate.x = raw.gyroscope.x;
      rawRotationRate.y = raw.gyroscope.y;
      rawRotationRate.z = raw.gyroscope.z;

      // Calibrate data
      /*   if (!isCalibrated) {
        calibrateData({
          acceleration: {
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z,
          },
          magneticField: {
            x: magneticField.x,
            y: magneticField.y,
            z: magneticField.z,
          },
        });
      } */

      elapsedTime.value = event.elapsedTime;
      interval.value = event.interval;

      recordedData.value.push({
        i: event.elapsedTime,
        ax: filteredAcceleration.x,
        ay: filteredAcceleration.y,
        az: filteredAcceleration.z,
        mx: filteredMagneticField.x,
        my: filteredMagneticField.y,
        mz: filteredMagneticField.z,
        rx: filteredRotationRate.x,
        ry: filteredRotationRate.y,
        rz: filteredRotationRate.z,
      });
    }
  };

  const startRecording = async () => {
    isRecording.value = true;
    recordedData.value = [];

    // Perform calibration before starting recording (only once per session)
    // if (!isCalibrated) {
    //   await calibrate();
    // }

    listener = await IosSensors.addListener("update", update);
  };

  const stopRecording = () => {
    isRecording.value = false;

    const len = appStore.sessions.length;
    const session = {
      id: len,
      label: label.value,
      time: elapsedTime.value,
      title: title.value,
      data: recordedData.value,
    };
    appStore.sessions.unshift(session);

    IosSensors.stop();
    listener?.remove();
  };

  /*  const calibrateData = () => {
    // Apply calibration logic if needed
    // For example, you can calculate the offsets based on initial readings
    calibrationOffsets.acceleration.x = acceleration.x;
    calibrationOffsets.acceleration.y = acceleration.y;
    calibrationOffsets.acceleration.z = acceleration.z;

    // Additional calibration logic for magnetometer
    calibrationOffsets.magneticField.x = magneticField.x;
    calibrationOffsets.magneticField.y = magneticField.y;
    calibrationOffsets.magneticField.z = magneticField.z;

    // Set the calibration flag to true
    isCalibrated = true;
  }; */

  /*  const calibrate = async () => {
    // Collect some initial sensor data for calibration
    const calibrationSamples = [];
    const calibrationDuration = 5000; // 5 seconds

    // Record sensor data during calibration period
    const startTime = Date.now();
    while (Date.now() - startTime < calibrationDuration) {
      calibrationSamples.push(await getRawSensorData()); // Replace with your actual sensor reading function
    }

    // Calculate average offsets for each axis
    calibrationOffsets.acceleration.x = calculateAverageOffset(
      calibrationSamples,
      "acceleration.x"
    );
    calibrationOffsets.acceleration.y = calculateAverageOffset(
      calibrationSamples,
      "acceleration.y"
    );
    calibrationOffsets.acceleration.z = calculateAverageOffset(
      calibrationSamples,
      "acceleration.z"
    );

    // Additional calibration for magnetometer
    calibrationOffsets.magneticField.x = calculateAverageOffset(
      calibrationSamples,
      "magneticField.x"
    );
    calibrationOffsets.magneticField.y = calculateAverageOffset(
      calibrationSamples,
      "magneticField.y"
    );
    calibrationOffsets.magneticField.z = calculateAverageOffset(
      calibrationSamples,
      "magneticField.z"
    );

    // Set the calibration flag to true
    isCalibrated = true;
  };

  const getRawSensorData = async () => {
    return new Promise((resolve) => {
      Motion.addListener("accel", (event) => {
        resolve({
          acceleration: event.acceleration,
          magneticField: event.magneticField,
        });
      });
    });
  }; */

  /* 
    This function calculates the average value of a given set of sensor readings over a specified duration. 
    It's typically used during the calibration process to determine an average offset or bias for each sensor axis (e.g., x, y, z). 
    The purpose is to capture a representative baseline value for each axis, 
    which can then be used to compensate for biases in subsequent sensor readings
   */
  /*  const calculateAverageOffset = (samples, axis) => {
    const sum = samples.reduce((acc, sample) => acc + sample[axis], 0);
    return sum / samples.length;
  }; */

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

    rawAcceleration,
    rawMagneticField,
    rawRotationRate,

    filteredAcceleration,
    filteredMagneticField,
    filteredRotationRate,
  };
};

export default useDeviceMotion;
