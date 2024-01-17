<template>
  <Transition @enter="enter" @leave="leave" appear :css="false">
    <div
      ref="rootRef"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      class="menu-hamburger"
    >
      <div class="inner" ref="innerRef">
        <div class="hamburger-line" ref="topRef"></div>
        <div class="hamburger-line" ref="centerRef"></div>
        <div class="hamburger-line" ref="bottomRef"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { MODAL_STATES } from "@/config/app";

const { appStore } = useStores();
const { modalState } = toRefs(appStore);

const rootRef = ref(null);
const topRef = ref(null);
const centerRef = ref(null);
const bottomRef = ref(null);
const innerRef = ref(null);

let click = () => {
  /*  $appStore.modal_state =
    modalState.value === MODAL_STATES.MENU
      ? MODAL_STATES.NONE
      : MODAL_STATES.MENU; */
};

let enter = (el, done) => {
  /* const lineRefs = [topRef.value, centerRef.value, bottomRef.value];
  $gsap.set(lineRefs, { x: "-100%" });
  $gsap.to(lineRefs, {
    duration: 1,
    x: "0%",
    ease: "expo.inOut",
    stagger: 0.15,
    delay: 2,
  }); */
  done();
};

let leave = (el, done) => {
  done();
};

/* let onModalStateChange = (val) => {
  let ease = "power3.out";
  if (val === MODAL_STATES.MENU) {
    let y = $resizeService.breakpoint === BREAKPOINT_TABLET_PORTRAIT ? 17 : 10;
    // gsap.to(topRef.value, 1, { scaleX: 0.75, rotation: -225, y, ease });
    // gsap.to(centerRef.value, 1, { scaleX: 0, ease });
    // gsap.to(bottomRef.value, 1, { scaleX: 0.75, rotation: 45, y: -y, ease });
    // $gsap.to(innerRef.value, 1, { y: -y * 0.5, ease })
  } else {
    // gsap.to(topRef.value, 1, { scaleX: 1, rotation: 0, y: 0, ease });
    // gsap.to(centerRef.value, 1, { scaleX: 1, ease });
    // gsap.to(bottomRef.value, 1, { scaleX: 1, rotation: 0, y: 0, ease });
    //$gsap.to(innerRef.value, 1, { y: 0, ease })
  }
}; */

watch(modalState, (val) => {
  // onModalStateChange(val);
});
</script>

<style scoped lang="sass">

.menu-hamburger
  width: 100%
  position: relative
  top: 0
  left: 0
  overflow: hidden
  align-self: flex-end
  grid-column: 2/3


  .inner
    height: 3rem
    width: 100%
    display: flex
    flex-direction: column
    justify-content: space-between



  .hamburger-line
    height: 3px
    width: 100%
    background-color: currentColor
    transform: translate3d(-500, 0, 0)

  &.home
    .hamburger-line
      background-color: white
</style>
