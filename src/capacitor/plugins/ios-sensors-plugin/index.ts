import { registerPlugin } from "@capacitor/core";

import type { IosSensorsPlugin } from "./definitions";

const IosSensors = registerPlugin<IosSensorsPlugin>("IosSensors", {
  web: () => import("./web").then((m) => new m.IosSensorsWeb()),
  ios: () => import("./web").then((m) => new m.IosSensorsWeb()),
});

export * from "./definitions";
export { IosSensors };
