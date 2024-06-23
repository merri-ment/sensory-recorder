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

// needs to be a multiple of 3
const maxLength = 3 * 1000;

// - - - - - - - - -- - - - -

// MotionDevice Local Coords debug lines

function pathDebugger(lineColor, boxColor, id) {
  const geometry = new BufferGeometry();
  const vertices = new Float32Array(maxLength); // Adjust the size as needed (1000 vertices)
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  const line = new Line(
    geometry,
    new LineBasicMaterial({
      color: lineColor,
      linewidth: 10,
      side: DoubleSide,
    })
  );
  scene.add(line);

  const mesh = new Mesh(
    new BoxGeometry(0.1, 0.1, 0.1),
    new MeshBasicMaterial({ color: boxColor, wireframe: true })
  );
  scene.add(mesh);

  // added threshold and decrement to dampen velocity
  const threshold = 0.05;
  const decrement = 0.9;
  const position = new Vector3(0, 0, 0);
  let velocity = { x: 0, y: 0, z: 0 };
  let index = 0;

  const update = ({
    dt,
    rotation = null,
    acc = null,
    scale = 1,
    applyVelocity = true,
  }) => {
    if (!acc) {
      console.log(id, "no acc");
      return;
    }

    if (!acc.x || !acc.y || !acc.z) {
      return;
    }

    if (rotation) {
      if (!rotation.x || !rotation.y || !rotation.z) {
      } else {
        mesh.rotation.copy(rotation);
      }
    }

    if (applyVelocity) {
      // Only update the velocity if the acceleration is above the threshold
      if (Math.abs(acc.x) > threshold) {
        velocity.x += acc.x /* * dt */;
      } else {
        velocity.x *= decrement;
      }

      if (Math.abs(acc.z) > threshold) {
        velocity.y += acc.z /* * dt */;
      } else {
        velocity.y *= decrement;
      }

      if (acc.y && Math.abs(acc.y) > threshold) {
        velocity.z += acc.y /* * dt */;
      } else {
        velocity.z *= decrement;
      }

      // Integrate velocity to get position
      position.x -= velocity.x * dt * scale;
      position.y -= velocity.z * dt * scale;
      position.z -= velocity.y * dt * scale;
    } else {
      position.x -= acc.x * dt * scale;
      position.y -= acc.z * dt * scale;
      position.z -= acc.y * dt * scale;
    }

    mesh.position.copy(position);

    // Update vertices
    if (index < maxLength / 3 - 1) {
      vertices[index * 3] = position.x;
      vertices[index * 3 + 1] = position.y;
      vertices[index * 3 + 2] = position.z;
      index++;
    } else {
      // Shift vertices to the left
      for (let i = 0; i < vertices.length - 3; i += 3) {
        vertices[i] = vertices[i + 3];
        vertices[i + 1] = vertices[i + 4];
        vertices[i + 2] = vertices[i + 5];
      }
      // Add new vertex at the end
      vertices[vertices.length - 3] = position.x;
      vertices[vertices.length - 2] = position.y;
      vertices[vertices.length - 1] = position.z;
    }
    geometry.attributes.position.needsUpdate = true;
  };

  return {
    update,
    mesh,
  };
}

const nativeRawPath = pathDebugger(0x0000ff, 0x0000ff, "nativeRaw");
const nativeFilteredPath = pathDebugger(0xff03d7, 0xff03d7, "nativeFiltered");
nativeFilteredPath.mesh.rotation.reorder("YXZ");
nativeFilteredPath.mesh.rotationAutoUpdate = true;

// - - - - - - - - -- - - - -

// Debug axis
const axesHelper = new AxesHelper(3);
const xColor = new Color("red");
const yColor = new Color("green");
const zColor = new Color("blue");
axesHelper.setColors(xColor, yColor, zColor);
scene.add(axesHelper);

const setupThree = async () => {
  const canvas = stage.value;
  const antialias = true;
  const { ww, wh } = browserStore;

  camera = new PerspectiveCamera(75, ww / wh, 1, 1000);

  controls = new OrbitControls(camera, canvas);
  camera.position.set(0, 0, 5);
  controls.update();

  // Debug grid
  const size = 200;
  const divisions = 300;
  const gridHelper = new GridHelper(size, divisions);
  lineContainer.add(gridHelper);
  lineContainer.visible = true;
  scene.add(lineContainer);

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

const updatePath = (val) => {
  lineContainer.clear();
  const id = Number(route.params.slug);
  const session = appStore.getSessionById(id);

  console.log(session);
  path = createPath(session.data);
  lineContainer.add(path);
};

let orientation = { alpha: 0, beta: 0, gamma: 0 };
let device = { alpha: 0, beta: 0, gamma: 0 };
let screenOrientation = 0;
let lastTime = Date.now();
let worldAcc = { x: 0, y: 0, z: 0 };
let acc;
let gyro;

// Inside onScreen_OrientationChange() we are supposed to use window.orientation values, but it is now deprecated. {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
// Screen.orientation.type is used instead, available on the window.screen property {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/screen}.
const windowOrientation_map = {
  270: -90 * DEG_TO_RAD,
  "-90": -90 * DEG_TO_RAD,
  90: 90 * DEG_TO_RAD,
  0: 0,
  null: 0,
  undefined: 0,
};

const onScreenOrientationChange = (event) => {
  console.info(`The orientation event is of type ${event.type}`);
  // We can identify the type of event that has been triggered using the type attribute of the event object

  if (screen.orientation) {
    const orientation = screen.orientation;
    screenOrientation = windowOrientation_map[orientation.angle];
    console.log(
      `Inputs are: ${orientation.angle} degrees. Result is ${screenOrientation} radians.`
    );
    return;
  }

  // Fallback
  screenOrientation = 0;
  console.log(`Screen orientation is ${screenOrientation} radians.`);
};

const onDeviceOrientationChange = (e) => {
  // localToWorld
  orientation.alpha = (e.alpha * Math.PI) / 180;
  orientation.beta = (e.beta * Math.PI) / 180;
  orientation.gamma = (e.gamma * Math.PI) / 180;
};

var setObjectQuaternion = function (alpha, beta, gamma, orient) {
  var zee = new Vector3(0, 0, 1);
  var euler = new Euler();
  var q0 = new Quaternion();
  var q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

  euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us
  var quaternion = new Quaternion().setFromEuler(euler); // orient the device
  quaternion.multiply(q1); // camera looks out the back of the device, not the top
  quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

  // Convert quaternion to Euler angles
  var eulerFromQuat = new Euler().setFromQuaternion(quaternion, "YXZ");

  return eulerFromQuat;
};

const updateNative = (delta) => {
  // filteredMagneticField

  if (!filteredAcceleration || !nativeFilteredPath || !nativeRawPath) {
    return;
  }

  const orient = screenOrientation ? screenOrientation : 0;
  const filteredEular = setObjectQuaternion(
    filteredRotationRate.x,
    filteredRotationRate.y,
    filteredRotationRate.z,
    orient
  );

  nativeFilteredPath?.update({
    dt: delta,
    acc: filteredAcceleration,
    rotation: filteredEular,
    scale: 5,
    applyVelocity: true,
  });

  const rawEular = setObjectQuaternion(
    rawRotationRate.x,
    rawRotationRate.y,
    rawRotationRate.z,
    orient
  );

  nativeRawPath?.update({
    dt: interval.value,
    acc: rawAcceleration,
    // rotation: rawEular,
    scale: 5,
    applyVelocity: true,
  });
};

const activate = async () => {
  console.log("window click");
  try {
    await DeviceMotionEvent.requestPermission();
    // Device motion handling
    // window.addEventListener("devicemotion", handleMotion, true);
    window.addEventListener("deviceorientation", onDeviceOrientationChange);
    window.addEventListener("orientationchange", onScreenOrientationChange);
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
