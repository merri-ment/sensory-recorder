class EventBus {
  constructor() {
    Object.assign(this, EventEmitter);
    Object.assign(this, EventObserver);
  }
}

export default new EventBus();
