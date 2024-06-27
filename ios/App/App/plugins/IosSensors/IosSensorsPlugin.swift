import Foundation
import Capacitor
import CoreMotion
import CoreLocation

@objc(IosSensorsPlugin)
public class IosSensorsPlugin: CAPPlugin, CLLocationManagerDelegate {
    
    private let motionManager = CMMotionManager()
    private let locationManager = CLLocationManager()
    private let altimeter = CMAltimeter()
    private var lastAccelerometerData = [String: Double]()
    private var lastGyroscopeData = [String: Double]()
    private var lastMagnetometerData = [String: Double]()
    private let alpha = 0.1 // Smoothing factor for EMA filtering

    private var startTime: TimeInterval = 0

    override public func load() {
        super.load()
        setupLocationManager()
    }

    private func setupLocationManager() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 0.1 // Update every 1 meter
    }

    @objc public func startDeviceMotion(_ call: CAPPluginCall) {
        guard motionManager.isDeviceMotionAvailable, motionManager.isMagnetometerAvailable else {
            call.reject("Motion sensors or magnetometer not available on this device.")
            return
        }

        startTime = 0
        setupMotionManager()
        startLocationUpdates()
        startAltimeterUpdates()

        motionManager.startDeviceMotionUpdates(using: .xArbitraryCorrectedZVertical, to: .main) { [weak self] (motionData, error) in
            guard let self = self, let motionData = motionData, error == nil else {
                call.reject("Error getting motion data: \(error?.localizedDescription ?? "Unknown error").")
                return
            }
            self.processMotionData(motionData)
        }

        call.resolve()
    }

    private func setupMotionManager() {
        motionManager.deviceMotionUpdateInterval = 1.0 / 60.0 // 60 times per second
        motionManager.magnetometerUpdateInterval = 1.0 / 60.0 // 60 times per second
    }

    private func startLocationUpdates() {
        locationManager.startUpdatingLocation()
    }

    private func startAltimeterUpdates() {
        if CMAltimeter.isRelativeAltitudeAvailable() {
            altimeter.startRelativeAltitudeUpdates(to: .main) { [weak self] (altitudeData, error) in
                guard let self = self, let data = altitudeData else { return }
                self.notifyAllListeners(pressure: data.pressure.doubleValue, relativeAltitude: data.relativeAltitude.doubleValue)
            }
        }
    }

    private func processMotionData(_ motionData: CMDeviceMotion) {
        let accelerometerData = [
            "x": motionData.userAcceleration.x,
            "y": motionData.userAcceleration.y,
            "z": motionData.userAcceleration.z
        ]
        let gyroscopeData = [
            "x": motionData.rotationRate.x,
            "y": motionData.rotationRate.y,
            "z": motionData.rotationRate.z
        ]
        let magnetometerData = [
            "x": motionData.magneticField.field.x,
            "y": motionData.magneticField.field.y,
            "z": motionData.magneticField.field.z
        ]

        let filteredAccelerometerData = lowPassFilter(accelerometerData, lastValue: &lastAccelerometerData)
        let filteredGyroscopeData = lowPassFilter(gyroscopeData, lastValue: &lastGyroscopeData)
        let filteredMagnetometerData = lowPassFilter(magnetometerData, lastValue: &lastMagnetometerData)

        let currentTime = motionData.timestamp
        if startTime == 0 {
            startTime = currentTime
        }
        let elapsedTime: TimeInterval = currentTime - startTime

        let eventData: [String: Any] = [ 
            "accelerometer": filteredAccelerometerData,
            "gyroscope": filteredGyroscopeData,
            "magnetometer": filteredMagnetometerData,
            "interval": motionManager.deviceMotionUpdateInterval,
            "elapsedTime": elapsedTime
        ]

        notifyAllListeners(eventData: eventData)
    }

    private func lowPassFilter(_ newValue: [String: Double], lastValue: inout [String: Double]) -> [String: Double] {
        if lastValue.isEmpty {
            return newValue
        }
        return [
            "x": alpha * newValue["x"]! + (1 - alpha) * lastValue["x"]!,
            "y": alpha * newValue["y"]! + (1 - alpha) * lastValue["y"]!,
            "z": alpha * newValue["z"]! + (1 - alpha) * lastValue["z"]!
        ]
    }

    private func notifyAllListeners(eventData: [String: Any] = [:], pressure: Double? = nil, relativeAltitude: Double? = nil) {
        var combinedData = eventData
        if let pressure = pressure, let relativeAltitude = relativeAltitude {
            combinedData["altimeter"] = [
                "pressure": pressure,
                "relativeAltitude": relativeAltitude
            ]
        }
        if let location = locationManager.location {
            combinedData["location"] = [
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude,
                "altitude": location.altitude,
                "speed": location.speed,
                "course": location.course,
                "timestamp": location.timestamp.timeIntervalSince1970
            ]
        }
        notifyListeners("update", data: combinedData)
    }

    @objc func stopDeviceMotion(_ call: CAPPluginCall) {
        motionManager.stopDeviceMotionUpdates()
        locationManager.stopUpdatingLocation()
        altimeter.stopRelativeAltitudeUpdates()
        call.resolve()
    }

    public func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        notifyAllListeners()
    }
}
