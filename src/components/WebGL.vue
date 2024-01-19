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
  scene.fog = new Fog(COLORS.PINK, 0, 40);

  const size = 200;
  const divisions = 300;

  const gridHelper = new GridHelper(size, divisions);
  lineContainer.add(gridHelper);

  lineContainer.visible = false;
  scene.add(lineContainer);

  renderer = new WebGLRenderer({ canvas, antialias });
  // renderer.setPixelRatio(2);
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

let motionPoint = { x: 0, y: 0, z: 0 };
const createPath = (motionData) => {
  // Create a point geometry
  var pathGeometry = new BufferGeometry();
  var pathMaterial = new LineBasicMaterial({
    color: COLORS.WHITE,
    linewidth: 10,
    side: DoubleSide,
    fog: false,
  });
  var positions = new Float32Array(motionData.length * 3);

  for (let i = 0; i < motionData.length; i++) {
    const scale = 1;
    const rotationFactor = 1; // Adjust this factor for the rotation sensitivity

    motionPoint.x += motionData[i].x;
    motionPoint.y += motionData[i].y;
    motionPoint.z += motionData[i].z;

    positions[i * 3] = motionPoint.x * scale;
    positions[i * 3 + 1] = motionPoint.y * scale;
    positions[i * 3 + 2] = motionPoint.z * scale;

    // Add rotation to the positions
    const rotationX = motionData[i].a * rotationFactor;
    const rotationY = motionData[i].b * rotationFactor;
    const rotationZ = motionData[i].g * rotationFactor;

    // Apply rotation to the positions
    // rotatePoint(positions, i * 3, rotationX, rotationY, rotationZ);
  }

  pathGeometry.setAttribute("position", new BufferAttribute(positions, 3));

  return new Line(pathGeometry, pathMaterial);
};

// Function to rotate a point in 3D space
function rotatePoint(positions, index, rotationX, rotationY, rotationZ) {
  const x = positions[index];
  const y = positions[index + 1];
  const z = positions[index + 2];

  // Apply rotation around the X-axis
  const rotatedX = x;
  const rotatedY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
  const rotatedZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);

  // Apply rotation around the Y-axis
  const finalRotatedX =
    rotatedX * Math.cos(rotationY) + rotatedZ * Math.sin(rotationY);
  const finalRotatedY = rotatedY;
  const finalRotatedZ =
    -rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);

  // Apply rotation around the Z-axis
  positions[index] =
    finalRotatedX * Math.cos(rotationZ) - finalRotatedY * Math.sin(rotationZ);
  positions[index + 1] =
    finalRotatedX * Math.sin(rotationZ) + finalRotatedY * Math.cos(rotationZ);
  positions[index + 2] = finalRotatedZ;
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
