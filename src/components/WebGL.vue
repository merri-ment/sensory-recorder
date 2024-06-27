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

const { startRecording, stopRecording, requestPermission } = useDeviceMotion();

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

const activate = async () => {
  try {
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
