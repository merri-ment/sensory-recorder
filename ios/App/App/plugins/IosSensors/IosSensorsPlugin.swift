import Foundation
import Capacitor
import CoreMotion

 
@objc(IosSensorsPlugin)
public class IosSensorsPlugin: CAPPlugin {
 
    private let motionManager = CMMotionManager()

  

    @objc public func startDeviceMotion(_ call: CAPPluginCall) {
        guard motionManager.isDeviceMotionAvailable && motionManager.isMagnetometerAvailable else {
            call.reject("Motion sensors or magnetometer not available on this device.")
            return
        }

        motionManager.deviceMotionUpdateInterval = 0.01  // Adjust the interval as needed
        motionManager.magnetometerUpdateInterval = 0.01  // Adjust the interval as needed
 
        
        var startTime: TimeInterval = 0

        motionManager.startDeviceMotionUpdates(using: CMAttitudeReferenceFrame.xArbitraryCorrectedZVertical, to: OperationQueue.main) { (motionData, error) in
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
            if startTime == 0 {
                startTime = motionData.timestamp
            }
            let elapsedTime: TimeInterval = currentTime - startTime

            let eventData: [String: Any] = [
                "accelerometer": accelerometerData,
                "gyroscope": gyroscopeData,
                "magnetometer": magnetometerData,
                "interval": self.motionManager.deviceMotionUpdateInterval,
                "elapsedTime": elapsedTime
            ]
//           print("timestamp: \(elapsedTime)")

            // Trigger the 'update' event with motion data
            self.notifyListeners("update", data: eventData)

            call.resolve()
        }
    }



    @objc func stopDeviceMotion(_ call: CAPPluginCall) {
        motionManager.stopDeviceMotionUpdates()
        call.resolve()
    }
}