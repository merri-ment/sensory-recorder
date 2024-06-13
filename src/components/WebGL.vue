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
  PointsMaterial,
  Line,
  BufferAttribute,
  LineBasicMaterial,
  MeshBasicMaterial,
  DoubleSide,
  Points,
  Mesh,
  SphereGeometry,
  AxesHelper,
  Fog,
  GridHelper,
  Euler,
  Vector3,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EVENTS, PAGES, MODAL_STATES, COLORS } from "@/config/app";
import { gsap } from "gsap";
import AHRS from "ahrs";

const ahrs = new AHRS({
  sampleInterval: 20,
  algorithm: "Mahony", // or 'Mahony'
  beta: 0.4,
});

const { browserStore, appStore } = useStores();
const route = useRoute();

const modalState = computed(() => appStore.modalState);
const tweenObj = { bgColor: COLORS.BLACK };

let scene = null;
let camera = null;
let renderer = null;
let path = null;
let controls = null;
let render = true;
let views = [];

const stage = ref(null);
const lineContainer = new Group();

const setupThree = async () => {
  const canvas = stage.value;
  const alpha = true;
  const antialias = true;
  const { ww, wh } = browserStore;

  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  controls = new OrbitControls(camera, canvas);
  camera.position.set(0, 15, 15);
  controls.update();

  scene = new Scene();
  // scene.fog = new Fog(COLORS.PINK, 0, 40);

  const axesHelper = new AxesHelper(3);
  const xColor = new Color("red");
  const yColor = new Color("green");
  const zColor = new Color("blue");
  axesHelper.setColors(xColor, yColor, zColor);
  scene.add(axesHelper);

  const size = 200;
  const divisions = 300;

  const gridHelper = new GridHelper(size, divisions);
  lineContainer.add(gridHelper);

  lineContainer.visible = false;
  scene.add(lineContainer);

  renderer = new WebGLRenderer({ canvas, antialias });
  renderer.setPixelRatio(window.devicePixelRatio);
};

let i = 0;
const onTick = (delta) => {
  const { ww, wh } = browserStore;

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

const updatePath = (val) => {
  lineContainer.clear();
  const id = Number(route.params.slug);
  const session = appStore.getSessionById(id);
  path = createPath(session.data);
  lineContainer.add(path);
};

const updateRoute = (val) => {
  lineContainer.visible = false;
  switch (val) {
    case PAGES.HOME:
      scene.background = new Color(COLORS.BLUE);
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
  render = true;
  friction = 0.04;
};

const projects = () => {
  render = true;
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

const modalMenu = () => {
  render = true;
};

const onRender = (val) => {
  render = val;
};

const createPath = (motionData) => {
  var pathGeometry = new BufferGeometry();
  var pathMaterial = new LineBasicMaterial({
    color: COLORS.WHITE,
    linewidth: 10,
    side: DoubleSide,
    fog: false,
  });
  var positions = new Float32Array(motionData.length * 3);

  let ay = motionData[0].ay;
  let az = motionData[0].az;
  let mx = motionData[0].mx;
  let my = motionData[0].my;
  let mz = motionData[0].mz;
  ahrs.init(ax, ay, az, mx, my, mz);

  for (let i = 0; i < motionData.length; i++) {
    const scale = 1;
    const rotationFactor = 1;
    const deltaThreshold = 0.005;

    // acceleration data
    const deltaX = motionData[i].ax;
    const deltaY = motionData[i].ay;
    const deltaZ = motionData[i].az;

    // Check if there is movement along X axis
    if (Math.abs(deltaX) > deltaThreshold) {
      // Update X position based on delta value
      ax += deltaX;
    }

    // Check if there is movement along Y axis
    if (Math.abs(deltaY) > deltaThreshold) {
      // Update Y position based on delta value
      ay += deltaY;
    }

    // Check if there is movement along Z axis
    if (Math.abs(deltaZ) > deltaThreshold) {
      // Update Z position based on delta value
      az += deltaZ;
    }

    // Update positions based on the final accumulated values
    positions[i * 3] = ax * scale;
    positions[i * 3 + 1] = ay * scale;
    positions[i * 3 + 2] = az * scale;

    // Apply rotation to the positions
    rotatePoint(positions, i * 3, motionData);
  }

  pathGeometry.setAttribute("position", new BufferAttribute(positions, 3));

  return new Line(pathGeometry, pathMaterial);
};

// Function to rotate a point in 3D space using Euler angles
function rotatePoint(positions, index, motionData) {
  const x = positions[index];
  const y = positions[index + 1];
  const z = positions[index + 2];

  // Replace the placeholder values with actual motion sensor data

  const { rx, ry, rz, mx, my, mz, ax, ay, az, i } = motionData[i];
  ahrs.update(rx, ry, rz, ax, ay, az, mx, my, mz, i);

  // Create Euler angles
  // const euler = new Euler(rotationY, rotationX, rotationZ, "YXZ");

  // Retrieve the orientation information
  // const quaternion = ahrs.getQuaternion();
  const euler = ahrs.getEulerAngles();

  // Create a 3D vector
  const vector = new Vector3(x, y, z);

  // Apply rotation to the vector
  vector.applyEuler(new Euler(euler.heading, euler.pitch, euler.roll, "YXZ"));

  console.log(euler);
  console.log(vector);

  // Update positions with the rotated values
  positions[index] = vector.x;
  positions[index + 1] = vector.y;
  positions[index + 2] = vector.z;
}

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
