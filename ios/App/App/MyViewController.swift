//
//  MyViewController.swift
//  App
//
//  Created by Cam O'Connell on 13/06/2024.
//

import UIKit
import Capacitor
 
class MyViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(IosSensorsPlugin())
    } 
}
