import Capacitor
import CoreMotion

@objc(IosSensorsPlugin)
public class IosSensorsPlugin: CAPPlugin {
    private let motionManager = CMMotionManager()
    private var isListening = false
    private var lastMotionTimestamp: TimeInterval?

    @objc public func startDeviceMotion(_ call: CAPPluginCall) {
        guard motionManager.isDeviceMotionAvailable else {
            call.reject("Motion sensors not available on this device.")
            return
        }

        motionManager.deviceMotionUpdateInterval = 0.1

        if !isListening {
            motionManager.startDeviceMotionUpdates(to: OperationQueue.main) { (motionData, error) in
                guard let motionData = motionData, error == nil else {
                    call.reject("Error getting motion data.")
                    return
                }

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

                let currentTime = motionData.timestamp
                var elapsedTime: TimeInterval = 0
                if let lastTime = self.lastMotionTimestamp {
                    elapsedTime = currentTime - lastTime
                }

                let eventData: [String: Any] = [
                    "accelerometer": accelerometerData,
                    "gyroscope": gyroscopeData,
                    "magnetometer": magnetometerData,
                    "interval": self.motionManager.deviceMotionUpdateInterval,
                    "elapsedTime": elapsedTime
                ]

                self.lastMotionTimestamp = currentTime

                self.notifyListeners("update", data: eventData)
            }

            isListening = true
        }
        call.resolve()
    }

    @objc func stopDeviceMotion(_ call: CAPPluginCall) {
        motionManager.stopDeviceMotionUpdates()
        isListening = false
        call.resolve()
    }
}
