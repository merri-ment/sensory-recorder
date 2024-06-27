<template>
  <div id="webgl">
    <canvas ref="stage" />
  </div>
</template>

<script setup>
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  Group,
  BufferGeometry,
  Line,
  BufferAttribute,
  LineBasicMaterial,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  AxesHelper,
  GridHelper,
  Euler,
  Vector3,
  Quaternion,
  BoxGeometry,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PAGES, MODAL_STATES, COLORS } from "@/config/app";

const {
  startRecording,
  stopRecording,
  filteredAcceleration,
  filteredMagneticField,
  filteredRotationRate,
  rawAcceleration,
  rawMagneticField,
  rawRotationRate,
  interval,
  requestPermission,
  geoLocation,
} = useDeviceMotion();

const { browserStore, appStore } = useStores();
const route = useRoute();

const modalState = computed(() => appStore.modalState);
const tweenObj = { bgColor: COLORS.BLACK };

let scene = new Scene();
let camera = null;
let renderer = null;
let path = null;
let controls = null;
let views = [];

const stage = ref(null);
const lineContainer = new Group();

// Debug axis
const axesHelper = new AxesHelper(3);
const xColor = new Color("red");
const yColor = new Color("green");
const zColor = new Color("blue");
axesHelper.setColors(xColor, yColor, zColor);
scene.add(axesHelper);

// Add a grid helper for reference
const gridHelper = new GridHelper(100, 100);
scene.add(gridHelper);

const setupThree = async () => {
  const canvas = stage.value;
  const antialias = true;
  const { ww, wh } = browserStore;

  camera = new PerspectiveCamera(75, ww / wh, 1, 1000); // Adjust the far plane to ensure objects are not clipped

  controls = new OrbitControls(camera, canvas);
  camera.position.set(0, 0, 100); // Position the camera further back
  controls.update();

  renderer = new WebGLRenderer({ canvas, antialias });
  renderer.setPixelRatio(window.devicePixelRatio);
};

const onTick = (delta) => {
  updateNative(delta);
  controls.update();
  renderer.render(scene, camera);
};

const resize = () => {
  const { ww, wh } = browserStore;

  if (renderer) {
    renderer.setSize(ww, wh);
  }

  if (camera) {
    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();
  }
};

// Constants
const EARTH_RADIUS = 6378137; // Earth's radius in meters
const DEG_TO_RAD = Math.PI / 180;
const SCALING_FACTOR = 1; // Adjust this to scale the path appropriately

class MovingAverageFilter {
  constructor(windowSize = 5) {
    this.windowSize = windowSize;
    this.values = [];
  }

  filter(value) {
    this.values.push(value);
    if (this.values.length > this.windowSize) {
      this.values.shift();
    }
    return this.values.reduce((sum, v) => sum + v, 0) / this.values.length;
  }
}

const latFilter = new MovingAverageFilter();
const lonFilter = new MovingAverageFilter();
const altFilter = new MovingAverageFilter();

function pathDebugger(lineColor, boxColor, id) {
  const geometry = new BufferGeometry();
  const vertices = new Float32Array(3 * 1000); // Adjust the size as needed
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  const line = new Line(
    geometry,
    new LineBasicMaterial({
      color: lineColor,
      linewidth: 2,
      side: DoubleSide,
    })
  );
  scene.add(line);

  const mesh = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: boxColor, wireframe: true })
  );
  scene.add(mesh);

  let referencePoint = null;
  let index = 0;

  function latLonToCartesian(lat, lon, alt) {
    const phi = (90 - lat) * DEG_TO_RAD;
    const theta = lon * DEG_TO_RAD;

    let x = (EARTH_RADIUS + alt) * Math.sin(phi) * Math.cos(theta);
    let y = (EARTH_RADIUS + alt) * Math.cos(phi);
    let z = (EARTH_RADIUS + alt) * Math.sin(phi) * Math.sin(theta);

    return new Vector3(x, y, z);
  }

  function normalizeCoordinates(lat, lon, alt) {
    if (!referencePoint) {
      if (Math.abs(lat) > 0 && Math.abs(lon) > 0 && Math.abs(alt) > 0) {
        console.log(lat, lon, alt);
        referencePoint = latLonToCartesian(lat, lon, alt);

        const currentPoint = latLonToCartesian(lat, lon, alt);
        const normalizedPoint = currentPoint.sub(referencePoint);

        // Apply scaling factor
        normalizedPoint.multiplyScalar(SCALING_FACTOR);

        return normalizedPoint;
      } else {
        return new Vector3(0, 0, 0);
      }
    } else {
      const currentPoint = latLonToCartesian(lat, lon, alt);
      const normalizedPoint = currentPoint.sub(referencePoint);

      // Apply scaling factor
      normalizedPoint.multiplyScalar(SCALING_FACTOR);

      return normalizedPoint;
    }
  }

  let lastPosition = new Vector3();
  const decayFactor = 0.9; // Adjust this value to control how quickly old positions are forgotten

  const update = ({ dt, acc }) => {
    if (geoLocation) {
      const filteredLat = latFilter.filter(geoLocation.latitude);
      const filteredLon = lonFilter.filter(geoLocation.longitude);
      const filteredAlt = altFilter.filter(geoLocation.altitude);

      // let position = normalizeCoordinates(
      //   filteredLat,
      //   filteredLon,
      //   filteredAlt
      // );

      let position = normalizeCoordinates(
        geoLocation.latitude,
        geoLocation.longitude,
        geoLocation.altitude
      );
      console.log(position.x, position.y, position.z);

      // Apply decay to the difference between new and last position
      // position = lastPosition.lerp(position, 1 - decayFactor);

      // Ensure minimum movement to prevent complete stagnation
      // const minMovement = 0.01;
      // if (position.distanceTo(lastPosition) < minMovement) {
      //   position.add(
      //     new Vector3(
      //       Math.random() * minMovement,
      //       Math.random() * minMovement,
      //       Math.random() * minMovement
      //     )
      //   );
      // }

      mesh.position.copy(position);

      // Update line vertices
      if (index < vertices.length / 3 - 1) {
        vertices[index * 3] = position.x;
        vertices[index * 3 + 1] = position.y;
        vertices[index * 3 + 2] = position.z;
        index++;
      } else {
        // Shift vertices and add new point
        for (let i = 0; i < vertices.length - 3; i += 3) {
          vertices[i] = vertices[i + 3];
          vertices[i + 1] = vertices[i + 4];
          vertices[i + 2] = vertices[i + 5];
        }
        vertices[vertices.length - 3] = position.x;
        vertices[vertices.length - 2] = position.y;
        vertices[vertices.length - 1] = position.z;
      }

      geometry.attributes.position.needsUpdate = true;

      // Update camera to follow the path
      // camera.position.copy(position).add(new Vector3(0, 10, 20));
      // controls.target.copy(position);

      lastPosition.copy(position);
    }

    // Use accelerometer data for more precise short-term movement
    if (acc) {
      const movement = new Vector3(
        (acc.x * dt * dt) / 2,
        (acc.y * dt * dt) / 2,
        (acc.z * dt * dt) / 2
      );
      movement.multiplyScalar(SCALING_FACTOR * 0.1); // Reduce the impact of accelerometer data

      mesh.position.add(movement);

      // Update line vertices with accelerometer data
      if (index > 0) {
        vertices[index * 3 - 3] += movement.x;
        vertices[index * 3 - 2] += movement.y;
        vertices[index * 3 - 1] += movement.z;
        geometry.attributes.position.needsUpdate = true;
      }
    }
  };

  return {
    update,
    mesh,
  };
}

const nativeFilteredPath = pathDebugger(0xff03d7, 0xff03d7, "nativeFiltered");

const updateNative = (delta) => {
  if (!filteredAcceleration || !nativeFilteredPath) {
    return;
  }

  nativeFilteredPath.update({
    dt: delta,
    acc: filteredAcceleration,
    scale: 5,
  });
};
const activate = async () => {
  try {
    // await DeviceMotionEvent.requestPermission();

    window.removeEventListener("click", activate);

    await requestPermission();
    await startRecording();
  } catch (e) {
    // Handle error
    console.log(e);
    return;
  }
};

const updateRoute = (val) => {
  lineContainer.visible = false;
  switch (val) {
    case PAGES.HOME:
      scene.background = new Color(COLORS.BLUE);

      window.addEventListener("click", activate);

      break;
    case PAGES.RECORDINGS:
      scene.background = new Color(COLORS.PINK);
      break;
    case PAGES.SESSION:
      lineContainer.visible = true;
      scene.background = new Color(COLORS.PINK);
      updatePath();
      break;
    case PAGES.ABOUT:
      break;
  }

  resize();
};

const updateBgColor = () => {
  if (scene) {
    scene.background = new Color(tweenObj.bgColor);
  }
};

const home = () => {
  friction = 0.04;
};

const projects = () => {
  friction = 0.1;
};

const project = () => {};

const about = () => {
  friction = 0.04;
};

const updateModalState = (val) => {
  views.forEach((v) => v.updateModalState(val));
  const { modal_state } = appStore;
  switch (modal_state) {
    case MODAL_STATES.MENU:
      modalMenu();
      break;
    case MODAL_STATES.NONE:
      modalNone();
      break;
  }
};

const modalNone = () => {
  updateRoute(route.name);
};

const modalMenu = () => {};

const onRender = (val) => {};

onMounted(async () => {
  try {
    // ResizeService.on(ResizeService.EVENTS.RESIZE, resize);
    // EventBus.on(EVENTS.STAGE.RENDER, onRender);

    await nextTick();
    await nextTick();
    await nextTick();

    setupThree();

    Raf.add(onTick);
    Raf.start();

    updateRoute(route.name);
    resize();
  } catch (err) {
    console.log(err);
  }

  watch(
    () => route.name,
    (val) => updateRoute(val)
  );
  watch(modalState, (val) => updateModalState(val));
});
</script>

<style lang="sass" scoped>
@import "@/styles/shared.sass"
#webgl
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 100%
</style>
