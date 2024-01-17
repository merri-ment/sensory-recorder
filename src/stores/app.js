import { defineStore } from "pinia";
import { MODAL_STATES, LABELS } from "@/config/app";

const dummyData = [
  { i: 0, x: 0, y: 0, z: 0, a: 0, b: 0, g: 0 },
  { i: 0.1, x: 0.01, y: 0.02, z: 0.005, a: 0.2, b: 0.1, g: 0.05 },
  { i: 0.2, x: 0.02, y: 0.04, z: 0.01, a: 0.4, b: 0.2, g: 0.1 },
  { i: 0.3, x: 0.03, y: 0.06, z: 0.015, a: 0.6, b: 0.3, g: 0.15 },
  { i: 0.4, x: 0.04, y: 0.08, z: 0.02, a: 0.8, b: 0.4, g: 0.2 },
  { i: 0.5, x: 0.05, y: 0.1, z: 0.025, a: 1.0, b: 0.5, g: 0.25 },
  { i: 0.6, x: 0.06, y: 0.12, z: 0.03, a: 1.2, b: 0.6, g: 0.3 },
  { i: 0.7, x: 0.07, y: 0.14, z: 0.035, a: 1.4, b: 0.7, g: 0.35 },
  { i: 0.8, x: 0.08, y: 0.16, z: 0.04, a: 1.6, b: 0.8, g: 0.4 },
  { i: 0.9, x: 0.09, y: 0.18, z: 0.045, a: 1.8, b: 0.9, g: 0.45 },
  { i: 1.0, x: 0.1, y: 0.2, z: 0.05, a: 2.0, b: 1.0, g: 0.5 },
  { i: 1.1, x: 0.11, y: 0.22, z: 0.055, a: 2.2, b: 1.1, g: 0.55 },
  { i: 1.2, x: 0.12, y: 0.24, z: 0.06, a: 2.4, b: 1.2, g: 0.6 },
  { i: 1.3, x: 0.13, y: 0.26, z: 0.065, a: 2.6, b: 1.3, g: 0.65 },
  { i: 1.4, x: 0.14, y: 0.28, z: 0.07, a: 2.8, b: 1.4, g: 0.7 },
  { i: 1.5, x: 0.15, y: 0.3, z: 0.075, a: 3.0, b: 1.5, g: 0.75 },
  { i: 1.6, x: 0.16, y: 0.32, z: 0.08, a: 3.2, b: 1.6, g: 0.8 },
  { i: 1.7, x: 0.17, y: 0.34, z: 0.085, a: 3.4, b: 1.7, g: 0.85 },
  { i: 1.8, x: 0.18, y: 0.36, z: 0.09, a: 3.6, b: 1.8, g: 0.9 },
  { i: 1.9, x: 0.19, y: 0.38, z: 0.095, a: 3.8, b: 1.9, g: 0.95 },
  { i: 2.0, x: 0.2, y: 0.4, z: 0.1, a: 4.0, b: 2.0, g: 1.0 },
  { i: 2.1, x: 0.21, y: 0.42, z: 0.105, a: 4.2, b: 2.1, g: 1.05 },
  { i: 2.2, x: 0.22, y: 0.44, z: 0.11, a: 4.4, b: 2.2, g: 1.1 },
  { i: 2.3, x: 0.23, y: 0.46, z: 0.115, a: 4.6, b: 2.3, g: 1.15 },
  { i: 2.4, x: 0.24, y: 0.48, z: 0.12, a: 4.8, b: 2.4, g: 1.2 },
  { i: 2.5, x: 0.25, y: 0.5, z: 0.125, a: 5.0, b: 2.5, g: 1.25 },
  { i: 2.6, x: 0.26, y: 0.52, z: 0.13, a: 5.2, b: 2.6, g: 1.3 },
  { i: 2.7, x: 0.27, y: 0.54, z: 0.135, a: 5.4, b: 2.7, g: 1.35 },
  { i: 2.8, x: 0.28, y: 0.56, z: 0.14, a: 5.6, b: 2.8, g: 1.4 },
  { i: 2.9, x: 0.29, y: 0.58, z: 0.145, a: 5.8, b: 2.9, g: 1.45 },
  { i: 3.0, x: 0.3, y: 0.6, z: 0.15, a: 6.0, b: 3.0, g: 1.5 },
  { i: 3.1, x: 0.31, y: 0.62, z: 0.155, a: 6.2, b: 3.1, g: 1.55 },
  { i: 3.2, x: 0.32, y: 0.64, z: 0.16, a: 6.4, b: 3.2, g: 1.6 },
  { i: 3.3, x: 0.33, y: 0.66, z: 0.165, a: 6.6, b: 3.3, g: 1.65 },
  { i: 3.4, x: 0.34, y: 0.68, z: 0.17, a: 6.8, b: 3.4, g: 1.7 },
  { i: 3.5, x: 0.35, y: 0.7, z: 0.175, a: 7.0, b: 3.5, g: 1.75 },
  { i: 3.6, x: 0.36, y: 0.72, z: 0.18, a: 7.2, b: 3.6, g: 1.8 },
  { i: 3.7, x: 0.37, y: 0.74, z: 0.185, a: 7.4, b: 3.7, g: 1.85 },
  { i: 3.8, x: 0.38, y: 0.76, z: 0.19, a: 7.6, b: 3.8, g: 1.9 },
  { i: 3.9, x: 0.39, y: 0.78, z: 0.195, a: 7.8, b: 3.9, g: 1.95 },
  { i: 4.0, x: 0.4, y: 0.8, z: 0.2, a: 8.0, b: 4.0, g: 2.0 },
  { i: 4.1, x: 0.41, y: 0.82, z: 0.205, a: 8.2, b: 4.1, g: 2.05 },
  { i: 4.2, x: 0.42, y: 0.84, z: 0.21, a: 8.4, b: 4.2, g: 2.1 },
  { i: 4.3, x: 0.43, y: 0.86, z: 0.215, a: 8.6, b: 4.3, g: 2.15 },
  { i: 4.4, x: 0.44, y: 0.88, z: 0.22, a: 8.8, b: 4.4, g: 2.2 },
  { i: 4.5, x: 0.45, y: 0.9, z: 0.225, a: 9.0, b: 4.5, g: 2.25 },
  { i: 4.6, x: 0.46, y: 0.92, z: 0.23, a: 9.2, b: 4.6, g: 2.3 },
  { i: 4.7, x: 0.47, y: 0.94, z: 0.235, a: 9.4, b: 4.7, g: 2.35 },
  { i: 4.8, x: 0.48, y: 0.96, z: 0.24, a: 9.6, b: 4.8, g: 2.4 },
  { i: 4.9, x: 0.49, y: 0.98, z: 0.245, a: 9.8, b: 4.9, g: 2.45 },
  { i: 5.0, x: 0.5, y: 1.0, z: 0.25, a: 10.0, b: 5.0, g: 2.5 },
  { i: 5.1, x: 0.51, y: 1.02, z: 0.255, a: 10.2, b: 5.1, g: 2.55 },
];

export const useAppStore = defineStore({
  id: "app",
  state: () => {
    return {
      modalState: MODAL_STATES.NONE,
      labels: [...LABELS],
      sessions: [
        {
          id: 0,
          title: "session one",
          label: LABELS[0],
          data: dummyData,
          time: 87.0,
        },
        {
          id: 1,
          title: "session two",
          label: LABELS[1],
          data: dummyData,
          time: 7.0,
        },
        {
          id: 2,
          title: "session three",
          label: LABELS[2],
          data: dummyData,
          time: 12.0,
        },
        {
          id: 3,
          title: "session four",
          label: LABELS[3],
          data: dummyData,
          time: 24.0,
        },
        {
          id: 4,
          title: "session five",
          label: LABELS[2],
          data: dummyData,
          time: 11.0,
        },
        {
          id: 5,
          title: "session six",
          label: LABELS[0],
          data: dummyData,
          time: 10.0,
        },
        {
          id: 2,
          title: "session seven",
          label: LABELS[3],
          data: dummyData,
          time: 5.0,
        },
        {
          id: 3,
          title: "session eight",
          label: LABELS[0],
          data: dummyData,
          time: 21.0,
        },
        {
          id: 4,
          title: "session nine",
          label: LABELS[1],
          data: dummyData,
          time: 30.0,
        },
        {
          id: 5,
          title: "session ten",
          label: LABELS[1],
          data: dummyData,
          time: 2.0,
        },
      ],
    };
  },
  actions: {
    exportToCSV() {
      let csvContent =
        "data:text/csv;charset=utf-8," +
        "Timestamp,X,Y,Z,Alpha,Beta,Gamma,Label\n";

      this.sessions.forEach((session) => {
        session.data.forEach((val) => {
          console.log(val.i);
          const row = `${val.i},${val.x},${val.y},${val.z},${val.a},${val.b},${val.g},${session.label}`;
          csvContent += row + "\n";
        });
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "recorded_data.csv");

      document.body.appendChild(link);
      link.click();
    },

    getSessionById(id) {
      return this.sessions.find((session) => session.id === id);
    },
  },
  getters: {},
});
