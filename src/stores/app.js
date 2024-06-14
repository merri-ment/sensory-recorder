import { defineStore } from "pinia";
import { MODAL_STATES, LABELS } from "@/config/app";

import { Directory, Filesystem, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

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
  { i: 0, ax: 0, ay: 0, az: 0, rx: 0, ry: 0, rz: 0 },
  { i: 0.1, ax: 0.01, ay: 0.02, az: 0.005, rx: 0.2, ry: 0.1, rz: 0.05 },
  { i: 0.2, ax: 0.02, ay: 0.04, az: 0.01, rx: 0.4, ry: 0.2, rz: 0.1 },
  { i: 0.3, ax: 0.03, ay: 0.06, az: 0.015, rx: 0.6, ry: 0.3, rz: 0.15 },
  { i: 0.4, ax: 0.04, ay: 0.08, az: 0.02, rx: 0.8, ry: 0.4, rz: 0.2 },
  { i: 0.5, ax: 0.05, ay: 0.1, az: 0.025, rx: 1.0, ry: 0.5, rz: 0.25 },
  { i: 0.6, ax: 0.06, ay: 0.12, az: 0.03, rx: 1.2, ry: 0.6, rz: 0.3 },
  { i: 0.7, ax: 0.07, ay: 0.14, az: 0.035, rx: 1.4, ry: 0.7, rz: 0.35 },
  { i: 0.8, ax: 0.08, ay: 0.16, az: 0.04, rx: 1.6, ry: 0.8, rz: 0.4 },
  { i: 0.9, ax: 0.09, ay: 0.18, az: 0.045, rx: 1.8, ry: 0.9, rz: 0.45 },
  { i: 1.0, ax: 0.1, ay: 0.2, az: 0.05, rx: 2.0, ry: 1.0, rz: 0.5 },
  { i: 1.1, ax: 0.11, ay: 0.22, az: 0.055, rx: 2.2, ry: 1.1, rz: 0.55 },
  { i: 1.2, ax: 0.12, ay: 0.24, az: 0.06, rx: 2.4, ry: 1.2, rz: 0.6 },
  { i: 1.3, ax: 0.13, ay: 0.26, az: 0.065, rx: 2.6, ry: 1.3, rz: 0.65 },
  { i: 1.4, ax: 0.14, ay: 0.28, az: 0.07, rx: 2.8, ry: 1.4, rz: 0.7 },
  { i: 1.5, ax: 0.15, ay: 0.3, az: 0.075, rx: 3.0, ry: 1.5, rz: 0.75 },
  { i: 1.6, ax: 0.16, ay: 0.32, az: 0.08, rx: 3.2, ry: 1.6, rz: 0.8 },
  { i: 1.7, ax: 0.17, ay: 0.34, az: 0.085, rx: 3.4, ry: 1.7, rz: 0.85 },
  { i: 1.8, ax: 0.18, ay: 0.36, az: 0.09, rx: 3.6, ry: 1.8, rz: 0.9 },
  { i: 1.9, ax: 0.19, ay: 0.38, az: 0.095, rx: 3.8, ry: 1.9, rz: 0.95 },
  { i: 2.0, ax: 0.2, ay: 0.4, az: 0.1, rx: 4.0, ry: 2.0, rz: 1.0 },
  { i: 2.1, ax: 0.21, ay: 0.42, az: 0.105, rx: 4.2, ry: 2.1, rz: 1.05 },
  { i: 2.2, ax: 0.22, ay: 0.44, az: 0.11, rx: 4.4, ry: 2.2, rz: 1.1 },
  { i: 2.3, ax: 0.23, ay: 0.46, az: 0.115, rx: 4.6, ry: 2.3, rz: 1.15 },
  { i: 2.4, ax: 0.24, ay: 0.48, az: 0.12, rx: 4.8, ry: 2.4, rz: 1.2 },
  { i: 2.5, ax: 0.25, ay: 0.5, az: 0.125, rx: 5.0, ry: 2.5, rz: 1.25 },
  { i: 2.6, ax: 0.26, ay: 0.52, az: 0.13, rx: 5.2, ry: 2.6, rz: 1.3 },
  { i: 2.7, ax: 0.27, ay: 0.54, az: 0.135, rx: 5.4, ry: 2.7, rz: 1.35 },
  { i: 2.8, ax: 0.28, ay: 0.56, az: 0.14, rx: 5.6, ry: 2.8, rz: 1.4 },
  { i: 2.9, ax: 0.29, ay: 0.58, az: 0.145, rx: 5.8, ry: 2.9, rz: 1.45 },
  { i: 3.0, ax: 0.3, ay: 0.6, az: 0.15, rx: 6.0, ry: 3.0, rz: 1.5 },
  { i: 3.1, ax: 0.31, ay: 0.62, az: 0.155, rx: 6.2, ry: 3.1, rz: 1.55 },
  { i: 3.2, ax: 0.32, ay: 0.64, az: 0.16, rx: 6.4, ry: 3.2, rz: 1.6 },
  { i: 3.3, ax: 0.33, ay: 0.66, az: 0.165, rx: 6.6, ry: 3.3, rz: 1.65 },
  { i: 3.4, ax: 0.34, ay: 0.68, az: 0.17, rx: 6.8, ry: 3.4, rz: 1.7 },
  { i: 3.5, ax: 0.35, ay: 0.7, az: 0.175, rx: 7.0, ry: 3.5, rz: 1.75 },
  { i: 3.6, ax: 0.36, ay: 0.72, az: 0.18, rx: 7.2, ry: 3.6, rz: 1.8 },
  { i: 3.7, ax: 0.37, ay: 0.74, az: 0.185, rx: 7.4, ry: 3.7, rz: 1.85 },
  { i: 3.8, ax: 0.38, ay: 0.76, az: 0.19, rx: 7.6, ry: 3.8, rz: 1.9 },
  { i: 3.9, ax: 0.39, ay: 0.78, az: 0.195, rx: 7.8, ry: 3.9, rz: 1.95 },
  { i: 4.0, ax: 0.4, ay: 0.8, az: 0.2, rx: 8.0, ry: 4.0, rz: 2.0 },
  { i: 4.1, ax: 0.41, ay: 0.82, az: 0.205, rx: 8.2, ry: 4.1, rz: 2.05 },
  { i: 4.2, ax: 0.42, ay: 0.84, az: 0.21, rx: 8.4, ry: 4.2, rz: 2.1 },
  { i: 4.3, ax: 0.43, ay: 0.86, az: 0.215, rx: 8.6, ry: 4.3, rz: 2.15 },
  { i: 4.4, ax: 0.44, ay: 0.88, az: 0.22, rx: 8.8, ry: 4.4, rz: 2.2 },
  { i: 4.5, ax: 0.45, ay: 0.9, az: 0.225, rx: 9.0, ry: 4.5, rz: 2.25 },
  { i: 4.6, ax: 0.46, ay: 0.92, az: 0.23, rx: 9.2, ry: 4.6, rz: 2.3 },
  { i: 4.7, ax: 0.47, ay: 0.94, az: 0.235, rx: 9.4, ry: 4.7, rz: 2.35 },
  { i: 4.8, ax: 0.48, ay: 0.96, az: 0.24, rx: 9.6, ry: 4.8, rz: 2.4 },
  { i: 4.9, ax: 0.49, ay: 0.98, az: 0.245, rx: 9.8, ry: 4.9, rz: 2.45 },
  { i: 5.0, ax: 0.5, ay: 1.0, az: 0.25, rx: 10.0, ry: 5.0, rz: 2.5 },
  { i: 5.1, ax: 0.51, ay: 1.02, az: 0.255, rx: 10.2, ry: 5.1, rz: 2.55 },
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
    async exportToCSV() {
      let csvContent =
        "Timestamp,Acceleration X,Acceleration Y,Acceleration Z,Magnetic X,Magnetic Y,Magnetic Z,Alpha,Beta,Gamma,Label\n";

      this.sessions.forEach((session) => {
        session.data.forEach((val) => {
          const row = `${val.i},${val.ax},${val.ay},${val.az},${val.mx},${val.my},${val.mz},${val.rx},${val.ry},${val.rz},${session.label}`;
          csvContent += row + "\n";
        });
      });

      const fileName = "recorded_data.csv";

      try {
        // Write the CSV file to the filesystem
        await Filesystem.writeFile({
          path: fileName,
          data: csvContent,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        // Get the URI of the file
        const result = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName,
        });

        // Share the file
        await Share.share({
          title: "Recorded Data",
          text: "GyroGraph :: Here is the recorded data",
          url: result.uri,
          dialogTitle: "GyroGraph :: Share the recorded data",
        });
      } catch (error) {
        console.error("Error writing or sharing the file", error);
      }
    },

    getSessionById(id) {
      return this.sessions.find((session) => session.id === id);
    },
  },
  getters: {},
});
