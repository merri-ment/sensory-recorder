import { useAppStore } from "@/stores/app";
import { useDeviceMotionStore } from "@/stores/devicemotion";
import { useBrowserStore } from "@/stores/browser";

export const useStores = function (opts) {
  return {
    deviceMotionStore: useDeviceMotionStore(),
    appStore: useAppStore(),
    browserStore: useBrowserStore(),
  };
};

export default useStores;
