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

import ResizeService from "@/services/ResizeService";

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

  let x = motionData[0].ax;
  let y = motionData[0].ay;
  let z = motionData[0].az;

  for (let i = 0; i < motionData.length; i++) {
    const scale = 1;
    const rotationFactor = 1;
    const deltaThreshold = 0.1;

    // acceleration data
    const deltaX = motionData[i].ax;
    const deltaY = motionData[i].ay;
    const deltaZ = motionData[i].az;

    // Check if there is movement along X axis
    if (Math.abs(deltaX) > deltaThreshold) {
      // Update X position based on delta value
      x += deltaX;
    }

    // Check if there is movement along Y axis
    if (Math.abs(deltaY) > deltaThreshold) {
      // Update Y position based on delta value
      y += deltaY;
    }

    // Check if there is movement along Z axis
    if (Math.abs(deltaZ) > deltaThreshold) {
      // Update Z position based on delta value
      z += deltaZ;
    }

    // Update positions based on the final accumulated values
    positions[i * 3] = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * scale;

    const rotationX = motionData[i].a * rotationFactor;
    const rotationY = motionData[i].b * rotationFactor;
    const rotationZ = motionData[i].g * rotationFactor;

    // Apply rotation to the positions
    // rotatePoint(positions, i * 3, rotationX, rotationY, rotationZ);
  }

  pathGeometry.setAttribute("position", new BufferAttribute(positions, 3));

  return new Line(pathGeometry, pathMaterial);
};

// Function to rotate a point in 3D space using Euler angles
function rotatePoint(positions, index, rotationX, rotationY, rotationZ) {
  const x = positions[index];
  const y = positions[index + 1];
  const z = positions[index + 2];

  // Create Euler angles
  const euler = new Euler(rotationX, rotationY, rotationZ, "XYZ");

  // Create a 3D vector
  const vector = new Vector3(x, y, z);

  // Apply rotation to the vector
  vector.applyEuler(euler);

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
