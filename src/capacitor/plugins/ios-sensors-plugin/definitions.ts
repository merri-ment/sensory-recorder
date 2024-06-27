import type { PluginListenerHandle } from "@capacitor/core";

export interface IosSensorsPlugin {
  startDeviceMotion(): Promise<any>;
  stopDeviceMotion(): Promise<any>;

  /**
   * Add a listener for sensor updates.
   *
   * @param eventName The name of the event to listen for ("update").
   * @param listenerFunc The callback function to handle the event.
   * @returns A promise resolving to a handle that can be used to remove the listener.
   * @since 1.0.0
   */
  addListener(
    eventName: "update",
    listenerFunc: SensorUpdateListener
  ): Promise<PluginListenerHandle>;

  /**
   * Remove all the listeners that are attached to this plugin.
   *
   * @since 1.0.0
   */
  removeListener(): Promise<void>;
}

/**
 * Callback function type for sensor update events.
 *
 * @param event The sensor update event.
 * @since 1.0.0
 */
export type SensorUpdateListener = (event: SensorUpdateEvent) => void;

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
   * The amount of magnetic field along the X axis.
   *
   * @since 1.0.0
   */
  x: number;

  /**
   * The amount of magnetic field along the Y axis.
   *
   * @since 1.0.0
   */
  y: number;

  /**
   * The amount of magnetic field along the Z axis.
   *
   * @since 1.0.0
   */
  z: number;
}

/**
 * Interface representing the sensor update event.
 *
 * @since 1.0.0
 */
export interface SensorUpdateEvent {
  /**
   * An object containing the accelerometer data.
   *
   * @since 1.1.0
   */
  accelerometer: Acceleration;

  /**
   * An object containing the gyroscope data.
   *
   * @since 1.1.0
   */
  gyroscope: RotationRate;

  /**
   * An object containing the magnetometer data.
   *
   * @since 1.1.0
   */
  magnetometer: MagneticField;

  /**
   * A number representing the interval of time, in seconds, at which data is obtained from the device.
   *
   * @since 1.0.0
   */
  interval: number;

  /**
   * A number representing the elapsed time, in seconds, since the start of the data collection.
   *
   * @since 1.0.0
   */
  elapsedTime: number;

  /**
   * An object containing the location data.
   *
   * @since 1.1.0
   */
  location?: LocationData;

  /**
   * An object containing the altimeter data.
   *
   * @since 1.1.0
   */
  altimeter?: AltimeterData;
}

/**
 * Interface representing the location data.
 *
 * @since 1.1.0
 */
export interface LocationData {
  /**
   * The latitude in degrees.
   *
   * @since 1.1.0
   */
  latitude: number;

  /**
   * The longitude in degrees.
   *
   * @since 1.1.0
   */
  longitude: number;

  /**
   * The altitude in meters.
   *
   * @since 1.1.0
   */
  altitude: number;

  /**
   * The speed in meters per second.
   *
   * @since 1.1.0
   */
  speed: number;

  /**
   * The course in degrees.
   *
   * @since 1.1.0
   */
  course: number;

  /**
   * The timestamp of the location data.
   *
   * @since 1.1.0
   */
  timestamp: number;
}

/**
 * Interface representing the altimeter data.
 *
 * @since 1.1.0
 */
export interface AltimeterData {
  /**
   * The pressure in kilopascals.
   *
   * @since 1.1.0
   */
  pressure: number;

  /**
   * The relative altitude in meters.
   *
   * @since 1.1.0
   */
  relativeAltitude: number;
}
