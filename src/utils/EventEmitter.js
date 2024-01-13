const EventEmitter = {};

EventEmitter.subscribe = function (
  name,
  callback,
  order = -1,
  invokeValue = undefined
) {
  this.on(name, callback, order);
  // invoke immediately if have callback value
  if (invokeValue !== undefined) {
    callback(invokeValue);
  }

  return () => {
    this.off(name, callback);
  };
};

EventEmitter.on = function (name, callback, order = -1) {
  if (typeof callback !== "function") {
    return;
  }
  this._emitCallbacks = this._emitCallbacks || {};
  this._emitCallbacks[name] = this._emitCallbacks[name] || [];

  callback._callback_order = order === -1 ? 1000000 : order;

  // note using unshift (reverse default) as iteration will run from end of array.
  this._emitCallbacks[name].unshift(callback);
  // only sort if not using default order (default order is first in array / last invoked in iteration)
  if (order > -1) {
    this._emitCallbacks[name].sort((a, b) => {
      return b._callback_order - a._callback_order;
    });
  }
};

// obj.off() - remove all listeners
// obj.off([name]) - remove all listeners from eventType:[name]
// obj.off([name], [callback]) - remove  [callback] from eventType:[name]
EventEmitter.off = function (name, callback) {
  if (!this._emitCallbacks) {
    return;
  }

  if (!name && !callback) {
    this._emitCallbacks = null;
  }

  if (name && !callback) {
    this._emitCallbacks[name] = null;
  }

  if (name && callback && this._emitCallbacks[name]) {
    const i = this._emitCallbacks[name].indexOf(callback);
    if (i > -1) {
      this._emitCallbacks[name].splice(i, 1);
    }
  }
};

EventEmitter.emit = function (name, evt) {
  if (!(this._emitCallbacks && this._emitCallbacks[name])) {
    return;
  }
  // reverse for in callback unsubs
  const a = this._emitCallbacks[name];
  for (let i = a.length - 1; i > -1; i--) {
    a[i]?.(evt);
  }
};

EventEmitter.set = function (propKey, val, eventKey = null) {
  this.setEmit(propKey, val, eventKey);
};

EventEmitter.setEmit = function (key, val, eventKey = null) {
  if (this[key] !== val) {
    this[key] = val;
    eventKey = eventKey || key;
    this.emit(eventKey, val);
  }
};

EventEmitter.removeEventListener = EventEmitter.off;
EventEmitter.addEventListener = EventEmitter.on;
EventEmitter.trigger = EventEmitter.emit;

export { EventEmitter };
export default EventEmitter;
