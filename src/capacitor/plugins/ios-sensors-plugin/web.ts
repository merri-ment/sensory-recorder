import { WebPlugin } from "@capacitor/core";

import type { IosSensorsPlugin } from "./definitions";

export class IosSensorsWeb extends WebPlugin implements IosSensorsPlugin {
  constructor() {
    super();
  }

  async start(): Promise<any> {
    console.log("start");
    // this.startDeviceMotion();
  }

  async stop(): Promise<any> {
    // this.stopDeviceMotion();
  }
}
