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
import { Motion } from "@capacitor/motion";

const ahrs = new AHRS({
  sampleInterval: 20,
  algorithm: "Mahony", // or 'Mahony'
  beta: 0.4,
});

const { browserStore, appStore } = useStores();
const route = useRoute();

const modalState = computed(() => appStore.modalState);
const tweenObj = { bgColor: COLORS.BLACK };

let scene = new Scene();
let camera = null;
let renderer = null;
let path = null;
let controls = null;
let render = true;
let views = [];

const stage = ref(null);
const lineContainer = new Group();

// test
const material = new LineBasicMaterial({
  color: 0x0000ff,
  linewidth: 10,
  side: DoubleSide,
});
const geometry = new BufferGeometry();
const vertices = new Float32Array(3000); // Adjust the size as needed (1000 vertices)
geometry.setAttribute("position", new BufferAttribute(vertices, 3));
const line = new Line(geometry, material);
scene.add(line);

const axesHelper = new AxesHelper(3);
const xColor = new Color("red");
const yColor = new Color("green");
const zColor = new Color("blue");
axesHelper.setColors(xColor, yColor, zColor);
scene.add(axesHelper);

let x = 0,
  y = 0,
  z = 0;
let index = 0;

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

  // scene.fog = new Fog(COLORS.PINK, 0, 40);

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

  console.log(session);
  path = createPath(session.data);
  lineContainer.add(path);
};

let alpha = 0,
  beta = 0,
  gamma = 0; // device orientation angles

window.addEventListener("deviceorientation", (event) => {
  alpha = (event.alpha * Math.PI) / 180;
  beta = (event.beta * Math.PI) / 180;
  gamma = (event.gamma * Math.PI) / 180;
});

const handleMotion = (event) => {
  // Get acceleration data
  const acc = event.acceleration;
  if (acc) {
    // Convert device coordinates to world coordinates
    const rotationMatrix = getRotationMatrix(alpha, beta, gamma);
    const worldAcc = multiplyMatrixAndPoint(rotationMatrix, [
      acc.x,
      acc.y,
      acc.z,
    ]);

    x += worldAcc[0] * 0.01;
    y += worldAcc[1] * 0.01;
    z += worldAcc[2] * 0.01;

    // Update vertices
    if (index < vertices.length / 3 - 1) {
      vertices[index * 3] = x;
      vertices[index * 3 + 1] = y;
      vertices[index * 3 + 2] = z; // Comment this line
      index++;
    } else {
      // Shift vertices to the left
      for (let i = 3; i < vertices.length; i += 3) {
        vertices[i - 3] = vertices[i];
        vertices[i - 2] = vertices[i + 1];
        vertices[i - 1] = vertices[i + 2]; // Comment this line
      }
      vertices[vertices.length - 3] = x;
      vertices[vertices.length - 2] = y;
      vertices[vertices.length - 1] = z; // Comment this line
    }
    geometry.attributes.position.needsUpdate = true;
  }
};

function getRotationMatrix(alpha, beta, gamma) {
  // Compute rotation matrix
  const cA = Math.cos(alpha);
  const sA = Math.sin(alpha);
  const cB = Math.cos(beta);
  const sB = Math.sin(beta);
  const cG = Math.cos(gamma);
  const sG = Math.sin(gamma);

  // Rotation matrix is a 3x3 matrix
  return [
    [cA * cG - sA * sB * sG, -cB * sA, cA * sG + cG * sA * sB],
    [cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB],
    [-cB * sG, sB, cB * cG],
  ];
}

function multiplyMatrixAndPoint(matrix, point) {
  // Multiply a 3x3 matrix by a 3D point
  const [x, y, z] = point;
  return [
    matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
    matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
    matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z,
  ];
}

const activate = async () => {
  console.log("window click");
  try {
    await DeviceMotionEvent.requestPermission();
    // Device motion handling
    window.addEventListener("devicemotion", handleMotion, true);
    window.removeEventListener("click", activate);
  } catch (e) {
    // Handle error
    console.log(e);
    return;
  }

  // Once the user approves, can start listening:
  // accelHandler = await Motion.addListener("accel", handleMotion);
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
