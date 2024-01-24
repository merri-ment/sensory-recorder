import { defineStore } from "pinia";
import { MODAL_STATES, LABELS } from "@/config/app";

const dummyDataWithMagneticField = [
  { mx: 0, my: 0, mz: 0 },
  { mx: 0.2, my: 0.1, mz: 0.05 },
  { mx: 0.4, my: 0.2, mz: 0.1 },
  { mx: 0.6, my: 0.3, mz: 0.15 },
  { mx: 0.8, my: 0.4, mz: 0.2 },
  { mx: 1.0, my: 0.5, mz: 0.25 },
  { mx: 1.2, my: 0.6, mz: 0.3 },
  { mx: 1.4, my: 0.7, mz: 0.35 },
  { mx: 1.6, my: 0.8, mz: 0.4 },
  { mx: 1.8, my: 0.9, mz: 0.45 },
  { mx: 2.0, my: 1.0, mz: 0.5 },
  { mx: 2.2, my: 1.1, mz: 0.55 },
  { mx: 2.4, my: 1.2, mz: 0.6 },
  { mx: 2.6, my: 1.3, mz: 0.65 },
  { mx: 2.8, my: 1.4, mz: 0.7 },
  { mx: 3.0, my: 1.5, mz: 0.75 },
  { mx: 3.2, my: 1.6, mz: 0.8 },
  { mx: 3.4, my: 1.7, mz: 0.85 },
  { mx: 3.6, my: 1.8, mz: 0.9 },
  { mx: 3.8, my: 1.9, mz: 0.95 },
  { mx: 4.0, my: 2.0, mz: 1.0 },
  { mx: 4.2, my: 2.1, mz: 1.05 },
  { mx: 4.4, my: 2.2, mz: 1.1 },
  { mx: 4.6, my: 2.3, mz: 1.15 },
  { mx: 4.8, my: 2.4, mz: 1.2 },
  { mx: 5.0, my: 2.5, mz: 1.25 },
  { mx: 5.2, my: 2.6, mz: 1.3 },
  { mx: 5.4, my: 2.7, mz: 1.35 },
  { mx: 5.6, my: 2.8, mz: 1.4 },
  { mx: 5.8, my: 2.9, mz: 1.45 },
  { mx: 6.0, my: 3.0, mz: 1.5 },
  { mx: 6.2, my: 3.1, mz: 1.55 },
  { mx: 6.4, my: 3.2, mz: 1.6 },
  { mx: 6.6, my: 3.3, mz: 1.65 },
  { mx: 6.8, my: 3.4, mz: 1.7 },
  { mx: 7.0, my: 3.5, mz: 1.75 },
  { mx: 7.2, my: 3.6, mz: 1.8 },
  { mx: 7.4, my: 3.7, mz: 1.85 },
  { mx: 7.6, my: 3.8, mz: 1.9 },
  { mx: 7.8, my: 3.9, mz: 1.95 },
  { mx: 8.0, my: 4.0, mz: 2.0 },
  { mx: 8.2, my: 4.1, mz: 2.05 },
  { mx: 8.4, my: 4.2, mz: 2.1 },
  { mx: 8.6, my: 4.3, mz: 2.15 },
  { mx: 8.8, my: 4.4, mz: 2.2 },
  { mx: 9.0, my: 4.5, mz: 2.25 },
  { mx: 9.2, my: 4.6, mz: 2.3 },
  { mx: 9.4, my: 4.7, mz: 2.35 },
  { mx: 9.6, my: 4.8, mz: 2.4 },
  { mx: 9.8, my: 4.9, mz: 2.45 },
  { mx: 10.0, my: 5.0, mz: 2.5 },
  { mx: 10.2, my: 5.1, mz: 2.55 },
];

const dummyData = [
  { i: 0, ax: 0, ay: 0, az: 0, a: 0, b: 0, g: 0 },
  { i: 0.1, ax: 0.01, ay: 0.02, az: 0.005, a: 0.2, b: 0.1, g: 0.05 },
  { i: 0.2, ax: 0.02, ay: 0.04, az: 0.01, a: 0.4, b: 0.2, g: 0.1 },
  { i: 0.3, ax: 0.03, ay: 0.06, az: 0.015, a: 0.6, b: 0.3, g: 0.15 },
  { i: 0.4, ax: 0.04, ay: 0.08, az: 0.02, a: 0.8, b: 0.4, g: 0.2 },
  { i: 0.5, ax: 0.05, ay: 0.1, az: 0.025, a: 1.0, b: 0.5, g: 0.25 },
  { i: 0.6, ax: 0.06, ay: 0.12, az: 0.03, a: 1.2, b: 0.6, g: 0.3 },
  { i: 0.7, ax: 0.07, ay: 0.14, az: 0.035, a: 1.4, b: 0.7, g: 0.35 },
  { i: 0.8, ax: 0.08, ay: 0.16, az: 0.04, a: 1.6, b: 0.8, g: 0.4 },
  { i: 0.9, ax: 0.09, ay: 0.18, az: 0.045, a: 1.8, b: 0.9, g: 0.45 },
  { i: 1.0, ax: 0.1, ay: 0.2, az: 0.05, a: 2.0, b: 1.0, g: 0.5 },
  { i: 1.1, ax: 0.11, ay: 0.22, az: 0.055, a: 2.2, b: 1.1, g: 0.55 },
  { i: 1.2, ax: 0.12, ay: 0.24, az: 0.06, a: 2.4, b: 1.2, g: 0.6 },
  { i: 1.3, ax: 0.13, ay: 0.26, az: 0.065, a: 2.6, b: 1.3, g: 0.65 },
  { i: 1.4, ax: 0.14, ay: 0.28, az: 0.07, a: 2.8, b: 1.4, g: 0.7 },
  { i: 1.5, ax: 0.15, ay: 0.3, az: 0.075, a: 3.0, b: 1.5, g: 0.75 },
  { i: 1.6, ax: 0.16, ay: 0.32, az: 0.08, a: 3.2, b: 1.6, g: 0.8 },
  { i: 1.7, ax: 0.17, ay: 0.34, az: 0.085, a: 3.4, b: 1.7, g: 0.85 },
  { i: 1.8, ax: 0.18, ay: 0.36, az: 0.09, a: 3.6, b: 1.8, g: 0.9 },
  { i: 1.9, ax: 0.19, ay: 0.38, az: 0.095, a: 3.8, b: 1.9, g: 0.95 },
  { i: 2.0, ax: 0.2, ay: 0.4, az: 0.1, a: 4.0, b: 2.0, g: 1.0 },
  { i: 2.1, ax: 0.21, ay: 0.42, az: 0.105, a: 4.2, b: 2.1, g: 1.05 },
  { i: 2.2, ax: 0.22, ay: 0.44, az: 0.11, a: 4.4, b: 2.2, g: 1.1 },
  { i: 2.3, ax: 0.23, ay: 0.46, az: 0.115, a: 4.6, b: 2.3, g: 1.15 },
  { i: 2.4, ax: 0.24, ay: 0.48, az: 0.12, a: 4.8, b: 2.4, g: 1.2 },
  { i: 2.5, ax: 0.25, ay: 0.5, az: 0.125, a: 5.0, b: 2.5, g: 1.25 },
  { i: 2.6, ax: 0.26, ay: 0.52, az: 0.13, a: 5.2, b: 2.6, g: 1.3 },
  { i: 2.7, ax: 0.27, ay: 0.54, az: 0.135, a: 5.4, b: 2.7, g: 1.35 },
  { i: 2.8, ax: 0.28, ay: 0.56, az: 0.14, a: 5.6, b: 2.8, g: 1.4 },
  { i: 2.9, ax: 0.29, ay: 0.58, az: 0.145, a: 5.8, b: 2.9, g: 1.45 },
  { i: 3.0, ax: 0.3, ay: 0.6, az: 0.15, a: 6.0, b: 3.0, g: 1.5 },
  { i: 3.1, ax: 0.31, ay: 0.62, az: 0.155, a: 6.2, b: 3.1, g: 1.55 },
  { i: 3.2, ax: 0.32, ay: 0.64, az: 0.16, a: 6.4, b: 3.2, g: 1.6 },
  { i: 3.3, ax: 0.33, ay: 0.66, az: 0.165, a: 6.6, b: 3.3, g: 1.65 },
  { i: 3.4, ax: 0.34, ay: 0.68, az: 0.17, a: 6.8, b: 3.4, g: 1.7 },
  { i: 3.5, ax: 0.35, ay: 0.7, az: 0.175, a: 7.0, b: 3.5, g: 1.75 },
  { i: 3.6, ax: 0.36, ay: 0.72, az: 0.18, a: 7.2, b: 3.6, g: 1.8 },
  { i: 3.7, ax: 0.37, ay: 0.74, az: 0.185, a: 7.4, b: 3.7, g: 1.85 },
  { i: 3.8, ax: 0.38, ay: 0.76, az: 0.19, a: 7.6, b: 3.8, g: 1.9 },
  { i: 3.9, ax: 0.39, ay: 0.78, az: 0.195, a: 7.8, b: 3.9, g: 1.95 },
  { i: 4.0, ax: 0.4, ay: 0.8, az: 0.2, a: 8.0, b: 4.0, g: 2.0 },
  { i: 4.1, ax: 0.41, ay: 0.82, az: 0.205, a: 8.2, b: 4.1, g: 2.05 },
  { i: 4.2, ax: 0.42, ay: 0.84, az: 0.21, a: 8.4, b: 4.2, g: 2.1 },
  { i: 4.3, ax: 0.43, ay: 0.86, az: 0.215, a: 8.6, b: 4.3, g: 2.15 },
  { i: 4.4, ax: 0.44, ay: 0.88, az: 0.22, a: 8.8, b: 4.4, g: 2.2 },
  { i: 4.5, ax: 0.45, ay: 0.9, az: 0.225, a: 9.0, b: 4.5, g: 2.25 },
  { i: 4.6, ax: 0.46, ay: 0.92, az: 0.23, a: 9.2, b: 4.6, g: 2.3 },
  { i: 4.7, ax: 0.47, ay: 0.94, az: 0.235, a: 9.4, b: 4.7, g: 2.35 },
  { i: 4.8, ax: 0.48, ay: 0.96, az: 0.24, a: 9.6, b: 4.8, g: 2.4 },
  { i: 4.9, ax: 0.49, ay: 0.98, az: 0.245, a: 9.8, b: 4.9, g: 2.45 },
  { i: 5.0, ax: 0.5, ay: 1.0, az: 0.25, a: 10.0, b: 5.0, g: 2.5 },
  { i: 5.1, ax: 0.51, ay: 1.02, az: 0.255, a: 10.2, b: 5.1, g: 2.55 },
];

for (let i = 0; i < dummyData.length; i++) {
  dummyData[i] = { ...dummyData[i], ...dummyDataWithMagneticField[i] };
}

export const useAppStore = defineStore({
  id: "app",
  state: () => {
    return {
      modalState: MODAL_STATES.NONE,
      labels: [...LABELS],
      session: {},
      sessions: [
        // {
        //   id: 0,
        //   title: "session one",
        //   label: LABELS[0],
        //   data: dummyData,
        //   time: 87.0,
        // },
        // {
        //   id: 1,
        //   title: "session two",
        //   label: LABELS[1],
        //   data: dummyData,
        //   time: 7.0,
        // },
        // {
        //   id: 2,
        //   title: "session three",
        //   label: LABELS[2],
        //   data: dummyData,
        //   time: 12.0,
        // },
        // {
        //   id: 3,
        //   title: "session four",
        //   label: LABELS[3],
        //   data: dummyData,
        //   time: 24.0,
        // },
        // {
        //   id: 4,
        //   title: "session five",
        //   label: LABELS[2],
        //   data: dummyData,
        //   time: 11.0,
        // },
        // {
        //   id: 5,
        //   title: "session six",
        //   label: LABELS[0],
        //   data: dummyData,
        //   time: 10.0,
        // },
        // {
        //   id: 2,
        //   title: "session seven",
        //   label: LABELS[3],
        //   data: dummyData,
        //   time: 5.0,
        // },
        // {
        //   id: 3,
        //   title: "session eight",
        //   label: LABELS[0],
        //   data: dummyData,
        //   time: 21.0,
        // },
        // {
        //   id: 4,
        //   title: "session nine",
        //   label: LABELS[1],
        //   data: dummyData,
        //   time: 30.0,
        // },
        // {
        //   id: 5,
        //   title: "session ten",
        //   label: LABELS[1],
        //   data: dummyData,
        //   time: 2.0,
        // },
      ],
    };
  },
  actions: {
    exportToCSV() {
      let csvContent =
        "Timestamp,Acceleration X,Acceleration Y,Acceleration Z,Magnetic X,Magnetic Y,Magnetic Z,Alpha,Beta,Gamma,Label\n";

      this.sessions.forEach((session) => {
        session.data.forEach((val) => {
          console.log(val.i);
          const row = `${val.i},${val.ax},${val.ay},${val.az},${val.mx},${val.my},${val.mz},${val.rx},${val.ry},${val.rz},${session.label}`;
          csvContent += row + "\n";
        });
      });

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded_data.csv";

      // Triggering a click event programmatically
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: false,
        view: window,
      });

      a.dispatchEvent(clickEvent);

      // Release the object URL
      URL.revokeObjectURL(url);
    },

    getSessionById(id) {
      return this.sessions.find((session) => session.id === id);
    },
  },
  getters: {},
});
