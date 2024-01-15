import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "app",
  state: () => {
    return {
      sessions: [],
    };
  },
  actions: {},
  getters: {},
});
