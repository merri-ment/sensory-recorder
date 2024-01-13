import { defineStore } from "pinia";
import ResizeService from "@/services/ResizeService";

const {
  ww,
  wh,
  breakpoint,
  scale,
  deviceType,
  orientation,
  fontSize,
  breakpointMobile,
  breakpointTablet,
  breakpointDesktop,
} = ResizeService;

export const useBrowserStore = defineStore({
  id: "browser",
  state: () => {
    return {
      ww,
      wh,
      breakpoint,
      scale,
      fontSize,
      deviceType,
      orientation,
      breakpointMobile,
      breakpointTablet,
      breakpointDesktop,
      gridScale: 1,
    };
  },
  actions: {},
  getters: {},
});
