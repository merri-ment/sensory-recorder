// import { Motion } from "@capacitor/motion";
import { IosSensors } from "@/capacitor/plugins/ios-sensors-plugin";

export const useDeviceMotion = function () {
  const { appStore } = useStores();

  const title = computed(
    () => `session <br/> ${NumberToWord(appStore.sessions.length)}`
  );
  const acceleration = reactive({ x: 0, y: 0, z: 0 });
  const magneticField = reactive({ x: 0, y: 0, z: 0 });
  const rotationRate = reactive({ x: 0, y: 0, z: 0 });

  const time = ref(0);
  const label = ref("");

  const recordedData = ref([]);
  const isRecording = ref(false);
  const permissionGranted = ref(false);

  const requestPermission = async () => {
    try {
      if (permissionGranted.value) {
        return true;
      } else {
        // await IosSensors.startDeviceMotion();
        // permissionGranted.value = true;
      }
    } catch (e) {
      permissionGranted.value = false;
      console.error(e);
      return;
    }
  };

  const update = (event) => {
    console.log("accelerometer :: " - event.accelerometer);
    if (isRecording.value) {
      acceleration.x = event.accelerometer.x;
      acceleration.y = event.accelerometer.y;
      acceleration.z = event.accelerometer.z;

      magneticField.x = event.magnetometer.x;
      magneticField.y = event.magnetometer.y;
      magneticField.z = event.magnetometer.z;

      rotationRate.x = event.gyroscope.x;
      rotationRate.y = event.gyroscope.y;
      rotationRate.z = event.gyroscope.z;

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

      /*  
        Apply exponential moving average (EMA) filtering to acceleration data
        EMA filter is used for real-time filtering of sensor data. 
        It's a digital filtering technique that gives more weight to recent measurements while attenuating the influence of older measurements. 
        This helps smooth out noise and variations in the data, providing a more stable output. 
        The EMA filter is applied iteratively as new sensor readings arrive, 
        and it helps in achieving a balance between responsiveness and stability in the data.
      */

      /*  const filterAlpha = 0.2; // Adjust as needed
      acceleration.x =
        filterAlpha * (acceleration.x - calibrationOffsets.acceleration.x) +
        (1 - filterAlpha) * acceleration.x;
      acceleration.y =
        filterAlpha * (acceleration.y - calibrationOffsets.acceleration.y) +
        (1 - filterAlpha) * acceleration.y;
      acceleration.z =
        filterAlpha * (acceleration.z - calibrationOffsets.acceleration.z) +
        (1 - filterAlpha) * acceleration.z;

      time.value += interval; */

      // Your logic for using magnetometer data goes here

      recordedData.value.push({
        i: event.elapsedTime,
        ax: acceleration.x,
        ay: acceleration.y,
        az: acceleration.z,
        mx: TruncateNumber(magneticField.x, 3),
        my: TruncateNumber(magneticField.y, 3),
        mz: TruncateNumber(magneticField.z, 3),
        rx: TruncateNumber(rotationRate.x, 3),
        ry: TruncateNumber(rotationRate.y, 3),
        rz: TruncateNumber(rotationRate.z, 3),
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

    IosSensors.addListener("update", update);

    // accelHandler = await Motion.addListener("accel", update);
  };

  const stopRecording = () => {
    isRecording.value = false;

    const len = appStore.sessions.length;
    const session = {
      id: len,
      label: label.value,
      time: time.value,
      title: title.value,
      data: recordedData.value,
    };
    console.log(session.data);
    appStore.sessions.unshift(session);
    /* if (accelHandler) {
      accelHandler.remove();
    } */
    IosSensors.stop();
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
    time,

    acceleration,
    magneticField,
    rotationRate,
  };
};

export default useDeviceMotion;
