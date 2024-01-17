<template>
  <div id="webgl">
    <canvas ref="stage" />
  </div>
</template>

<script setup>
import { OrthographicCamera, Scene, WebGLRenderer, Color, Group } from "three";
import { EVENTS, PAGES, MODAL_STATES, COLORS } from "@/config/app";
import { gsap } from "gsap";

import ResizeService from "@/services/ResizeService";

const { x, y } = useMouse();
const { pressed } = useMousePressed();
const { splitColor } = useGsap();
const { browserStore, appStore } = useStores();
const route = useRoute();

const modalState = computed(() => appStore.modalState);

const tweenObj = { bgColor: COLORS.BLACK };

let scene = null;
let camera = null;
let renderer = null;

let render = true;
let views = [];
const stage = ref(null);
let components;

const initComponents = (config) => {
  components = {};
  for (const [key, value] of Object.entries(components)) {
    scene.add(value);
    views.push(value);
  }
};

const setupScene = () => {
  const config = {
    renderer,
    camera,
    route,
    appStore,
    browserStore,
  };

  initComponents(config);
  resize();
};

const setupThree = async () => {
  const canvas = stage.value;
  const alpha = true;
  const antialias = true;
  const { ww, wh } = browserStore;

  camera = new OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 0, 1000);
  camera.position.z = 50;

  scene = new Scene();
  scene.background = new Color(COLORS.BLUE);

  renderer = new WebGLRenderer({ canvas, alpha, antialias });
  renderer.setPixelRatio(2);

  setupScene();
};

const onTick = (delta) => {
  const { ww, wh } = browserStore;

  if (render) {
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
};

const resize = () => {
  const { ww, wh } = browserStore;

  if (renderer) {
    renderer.setSize(ww, wh);
  }

  if (camera) {
    camera.left = ww / -2;
    camera.right = ww / 2;
    camera.top = wh / 2;
    camera.bottom = wh / -2;
    camera.updateProjectionMatrix();
  }

  views.forEach((view) => view.resize());
};

const updateRoute = (val) => {
  console.log(val);

  switch (val) {
    case PAGES.HOME:
      scene.background = new Color(COLORS.BLUE);
      break;
    case PAGES.RECORDINGS:
      scene.background = new Color(COLORS.PINK);
      break;
    case PAGES.SESSION:
      scene.background = new Color(COLORS.PINK);
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

onMounted(async () => {
  try {
    ResizeService.on(ResizeService.EVENTS.RESIZE, resize);
    EventBus.on(EVENTS.STAGE.RENDER, onRender);

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
