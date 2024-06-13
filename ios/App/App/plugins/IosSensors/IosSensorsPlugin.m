#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(IosSensorsPlugin, "IosSensors",
  CAP_PLUGIN_METHOD(startDeviceMotion, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(stopDeviceMotion, CAPPluginReturnPromise);
)
