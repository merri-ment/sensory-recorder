import { defineStore } from "pinia";

export const useDeviceMotionStore = defineStore({
  id: "device-motion",
  state: () => {
    return {
      acceleration: { x: 0, y: 0, z: 0 }, // The amount of acceleration along the X,Y,Z axis
      alpha: 0, // The amount of rotation around the Z axis, in degrees per second.
      beta: 0, // The amount of rotation around the X axis, in degrees per second.
      gamma: 0, // The amount of rotation around the Y axis, in degrees per second.
    };
  },
  actions: {
    update(value) {
      this.acceleration = value.acceleration;
      const { alpha, beta, gamma } = value.rotationRate;
      this.alpha = alpha;
      this.beta = beta;
      this.gamma = gamma;
    },
  },
  getters: {},
});
