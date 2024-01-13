import ResizeService from "@/services/ResizeService";

export default defineNuxtPlugin((nuxtApp) => {
  const { browserStore: store } = useStores();
  const update = () => {
    store.ww = ResizeService.width;
    store.wh = ResizeService.height;
    store.breakpoint = ResizeService.breakpoint;
    store.deviceType = ResizeService.deviceType;
    store.orientation = ResizeService.orientation;
    store.fontSize = ResizeService.fontSize;
    store.scale = ResizeService.scale;
    store.breakpointMobile = ResizeService.breakpointMobile;
    store.breakpointTablet = ResizeService.breakpointTablet;
    store.breakpointDesktop = ResizeService.breakpointDesktop;
    store.gridScale = store.ww < 1366 ? 1 : 1366 / store.ww;
  };
  ResizeService.on(ResizeService.EVENTS.PRESIZE, update);
  update();

  return {
    provide: {},
  };
});
