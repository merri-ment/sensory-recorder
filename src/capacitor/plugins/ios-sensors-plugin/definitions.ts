import type { PluginListenerHandle } from "@capacitor/core";

export interface IosSensorsPlugin {
  startDeviceMotion(): Promise<any>;
  stopDeviceMotion(): Promise<any>;

  /**
   * Add a listener for motion sensor updates.
   *
   * @param eventName The name of the event to listen for ("update").
   * @param listenerFunc The callback function to handle the event.
   * @returns A promise resolving to a handle that can be used to remove the listener.
   * @since 1.0.0
   */
  addListener(
    eventName: "update",
    listenerFunc: Listener
  ): Promise<PluginListenerHandle>;

  /**
   * Remove all the listeners that are attached to this plugin.
   *
   * @since 1.0.0
   */
  removeListener(): Promise<void>;
}

/**
 * Callback function type for motion sensor update events.
 *
 * @param event The motion sensor update event.
 * @since 1.0.0
 */
export type Listener = (event: ListenerEvent) => void;

/**
 * Interface representing the rotation rate data.
 *
 * @since 1.0.0
 */
export interface RotationRate {
  /**
   * The amount of rotation around the X axis, in degrees per second.
   *
   * @since 1.0.0
   */
  x: number;

  /**
   * The amount of rotation around the Y axis, in degrees per second.
   *
   * @since 1.0.0
   */
  y: number;

  /**
   * The amount of rotation around the Z axis, in degrees per second.
   *
   * @since 1.0.0
   */
  z: number;
}

/**
 * Interface representing the acceleration data.
 *
 * @since 1.0.0
 */
export interface Acceleration {
  /**
   * The amount of acceleration along the X axis.
   *
   * @since 1.0.0
   */
  x: number;

  /**
   * The amount of acceleration along the Y axis.
   *
   * @since 1.0.0
   */
  y: number;

  /**
   * The amount of acceleration along the Z axis.
   *
   * @since 1.0.0
   */
  z: number;
}

/**
 * Interface representing the magnetic field data.
 *
 * @since 1.0.0
 */
export interface MagneticField {
  /**
   * The amount of acceleration along the X axis.
   *
   * @since 1.0.0
   */
  x: number;

  /**
   * The amount of acceleration along the Y axis.
   *
   * @since 1.0.0
   */
  y: number;

  /**
   * The amount of acceleration along the Z axis.
   *
   * @since 1.0.0
   */
  z: number;
}

/**
 * Interface representing the motion sensor update event.
 *
 * @since 1.0.0
 */
export interface ListenerEvent {
  /**
   * An object giving the acceleration of the device on the three axes X, Y, and Z. Acceleration is expressed in m/s.
   *
   * @since 1.0.0
   */
  accelerometer: Acceleration;

  /**
   * An object giving the acceleration of the device on the three axes X, Y, and Z with the effect of gravity. Acceleration is expressed in m/s.
   *
   * @since 1.0.0
   */
  magnetometer: MagneticField;

  /**
   * An object giving the rate of change of the device's orientation on the three orientation axes alpha, beta, and gamma. Rotation rate is expressed in degrees per second.
   *
   * @since 1.0.0
   */
  gyroscope: RotationRate;

  /**
   * A number representing the interval of time, in milliseconds, at which data is obtained from the device.
   *
   * @since 1.0.0
   */
  interval: number;

  /**
   * A number representing the interval of time, in milliseconds, at which data is obtained from the device.
   *
   * @since 1.0.0
   */
  elapsedTime: number;
}
