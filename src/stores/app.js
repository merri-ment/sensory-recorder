import { defineStore } from "pinia";
import { MODAL_STATES, LABELS } from "@/config/app";

import { Directory, Filesystem, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export const useAppStore = defineStore({
  id: "app",
  state: () => {
    return {
      modalState: MODAL_STATES.NONE,
      labels: [...LABELS],
      session: {},
      sessions: [],
    };
  },
  actions: {
    async exportToCSV() {
      let csvContent =
        "Timestamp,Acceleration X,Acceleration Y,Acceleration Z,Magnetic X,Magnetic Y,Magnetic Z,Alpha,Beta,Gamma,Location Latitude,Location Longitude,Location Altitude,Location Speed,Location Course,Altimeter Pressure,Altimeter Relative Altitude,Label \n";

      this.sessions.forEach((session) => {
        session.data.forEach((val) => {
          const row = `${val.elapsedTime},${val.ax},${val.ay},${val.az},${val.mx},${val.my},${val.mz},${val.gx},${val.gy},${val.gz},${val.latitude},${val.longitude},${val.altitude},${val.speed},${val.course},${val.pressure},${val.relativeAltitude},${session.label}`;
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
