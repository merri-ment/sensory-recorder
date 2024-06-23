import Foundation
import Capacitor
import CoreMotion

@objc(IosSensorsPlugin)
public class IosSensorsPlugin: CAPPlugin {
    
    private let motionManager = CMMotionManager()
    private var lastAccelerometerData = [String: Double]()
    private var lastGyroscopeData = [String: Double]()
    private var lastMagnetometerData = [String: Double]()
    private let alpha = 0.1 // Smoothing factor

    @objc public func startDeviceMotion(_ call: CAPPluginCall) {
        guard motionManager.isDeviceMotionAvailable && motionManager.isMagnetometerAvailable else {
            call.reject("Motion sensors or magnetometer not available on this device.")
            return
        }

        motionManager.deviceMotionUpdateInterval = 0.01  // Adjust the interval as needed
        motionManager.magnetometerUpdateInterval = 0.01  // Adjust the interval as needed

        var startTime: TimeInterval = 0


        /* 
            EMA filtering

            Apply exponential moving average (EMA) filtering to acceleration data. 
            The EMA filter is used for real-time filtering of sensor data. 
            It is a digital filtering technique that assigns more weight to recent measurements while reducing the influence of older measurements. 
            This helps smooth out noise and variations in the data, providing a more stable output. 
            The EMA filter is applied iteratively as new sensor readings arrive, helping to achieve a balance between responsiveness and stability in the data.
        
            The formula used for the filter is: 
            filtered_value = α × new_value + ( 1 − α ) × last_value
        */

        func lowPassFilter(_ newValue: [String: Double], lastValue: inout [String: Double]) -> [String: Double] {
            if lastValue.isEmpty {
                return newValue
            }
            return [
                "x": alpha * newValue["x"]! + (1 - alpha) * lastValue["x"]!,
                "y": alpha * newValue["y"]! + (1 - alpha) * lastValue["y"]!,
                "z": alpha * newValue["z"]! + (1 - alpha) * lastValue["z"]!
            ]
        }

        motionManager.startDeviceMotionUpdates(using: CMAttitudeReferenceFrame.xArbitraryCorrectedZVertical, to: OperationQueue.main) { (motionData, error) in
            guard let motionData = motionData, error == nil else {
                call.reject("Error getting motion data.")
                return
            } 
            
            // Raw data from sensors
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

            // Basic filter
            let filteredAccelerometerData = lowPassFilter(accelerometerData, lastValue: &self.lastAccelerometerData)
            let filteredGyroscopeData = lowPassFilter(gyroscopeData, lastValue: &self.lastGyroscopeData)
            let filteredMagnetometerData = lowPassFilter(magnetometerData, lastValue: &self.lastMagnetometerData)

            let currentTime = motionData.timestamp
            if startTime == 0 {
                startTime = motionData.timestamp
            }
            let elapsedTime: TimeInterval = currentTime - startTime

            let raw = [
                "accelerometer": accelerometerData,
                "gyroscope": gyroscopeData,
                "magnetometer": magnetometerData,
            ]

            let filtered = [
                "accelerometer": filteredAccelerometerData,
                "gyroscope": filteredGyroscopeData,
                "magnetometer": filteredMagnetometerData,
            ]

            let eventData: [String: Any] = [
                "raw": raw,
                "filtered": filtered,
                "interval": self.motionManager.deviceMotionUpdateInterval,
                "elapsedTime": elapsedTime
            ]

            // Trigger the 'update' event with motion data
            self.notifyListeners("update", data: eventData)
        }

        call.resolve()
    }

    @objc func stopDeviceMotion(_ call: CAPPluginCall) {
        motionManager.stopDeviceMotionUpdates()
        call.resolve()
    }
}
