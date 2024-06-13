import { WebPlugin } from "@capacitor/core";

import type { IosSensorsPlugin } from "./definitions";

export class IosSensorsWeb extends WebPlugin implements IosSensorsPlugin {
  constructor() {
    super();
  }

  async start(): Promise<any> {
    console.log(this);
  }

  async stop(): Promise<any> {}
}
