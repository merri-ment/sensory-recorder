import { gsap } from "gsap";

class Raf {
  constructor() {
    this.running = false;
    this.rafId = null;
    this._fns = [];
    this._last = 0;
  }

  _update = (delta) => {
    const now = performance.now();
    let dt = (now - this._last) / 1000;
    if (dt > 1) dt = 1; // safety cap on large deltas
    this._last = now;

    let i = this._fns.length;
    while (i--) {
      let fn = this._fns[i];
      if (fn) this._fns[i](dt);
    }
  };

  start = () => {
    if (this.running) return;
    this.running = true;
    gsap.ticker.add(this._update);
  };

  stop = () => {
    gsap.ticker.remove(this._updateWithStats);
    gsap.ticker.remove(this._update);
    this.running = false;
  };

  add = (fn) => {
    if (typeof fn === "function") {
      if (this._fns.indexOf(fn) >= 0) return false;
      this._fns.push(fn);
      return true;
    } else {
      return false;
    }
  };

  remove = (fn) => {
    const idx = this._fns.indexOf(fn);
    if (idx >= 0) this._fns.splice(idx, 1);
  };
}

let raf = new Raf();
export default raf;
