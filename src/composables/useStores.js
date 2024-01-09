// import { useAppStore } from '@/store/app'
import { useDeviceMotionStore } from "@/stores/devicemotion";

export const useStores = function (opts) {
  return {
    deviceMotionStore: useDeviceMotionStore(),
    // appStore: useAppStore(),
  };
};

export default useStores;
