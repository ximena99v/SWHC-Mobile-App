# SD-SWHC
This project involves the development of a Smart Water Heater Controller using ESP32 technology. The goal was to create an energy-efficient system that could monitor and control water heater usage based on user-defined parameters and environmental data.

# Developing using a Windows computer (limited see MacOS section for full functionality):

**Important** : if you plan on developing with windows you need to comment out any of the imports and functions that use "@react-native-google-signin/google-signin" (login.js) or "@orbital-systems/react-native-esp-idf-provisioning" (BLEdemo.js, AddDevice.js, ScanScreen.js) 

**Prequisites**:
- Node.js installed
- Expo CLI installed globally: `npm install -g expo-cli`

**VScode:**
- run `npm install` inside the terminal to install node_modules
- run `npm start` or `npx expo start` to begin developement server
- Now use the "expo go" app to scan the QR code that is provided
- You can now see the application on the phone 



# Developing using a MacOS:

**VScode:**
- run `npm install` to install node_modules
- use `npx expo prebuild -p ios` to generate an ios folder.
- Open the file with the ext .xcworkspace in the ios folder that was generated by the prebuild command. This file needs to be open on Xcode.

**Xcode:**
- Once you've opened your .xcworkspace 
- In Signing & Capabilities,
    - Team: click on the drop down and select your team for example : Ximena Ramirez (Personal Team)
    - remove Push Notifications from capabilies if you're not using a paid subcription of an Apple Developer account.
    - Add your iPhone device in Xcode. To view this window, choose Window > Devices and Simulators. View and configure simulated devices from the Simulators tab. Use the (+) button to add and configure your iPhone for testing.
 
**Running the app on an iPhone (must be on the same wifi network and sharing the same ip address):**
- on VScode: use command `npx expo start` to start the metro server
- on Xcode: use Build to compile and Xcode will install the app onto your iPhone device.

**Running the app on an iPhone (no active metro server, using jsbundle instead).**
In order for the app to run on an iPhone with no active metro server running on vscode, you must generate a jsbundle file.
- on VScode: Build bundle by running the command `npx expo export:embed --entry-file='node_modules/expo/AppEntry.js' --bundle output='./ios/main.jsbundle' --dev=false --platform='ios'`
- Xcode: Click on top bar of the project, select `Edit Scheme`, select `Build Configuration` - Release
  -  Build phases -> Bundle React Native code and images -> Check off "For install builds only" if it's checked
- On Xcode, select your connected device. Use Build and Xcode will install the app on your connected iPhone. 

# Running the ESP32:
The ESP32 uses BLE to provision Wi-Fi credentials, enabling seamless connection to Firebase for continuous real-time data logging. It employs a stochastic algorithm to adjust the water heater's load based on grid frequency, promoting energy efficiency and grid stability. This design ensures reliability, scalability, and dynamic control of the smart water heater system.

**WifiProv:**
- The WiFiProv library is used to provision Wi-Fi credentials over a BLE signal, making it easy to connect the ESP32 to a Wi-Fi network without hardcoding credentials. Learn more about WiFiProv in the [official documentation.](https://github.com/espressif/arduino-esp32/tree/master/libraries/WiFiProv/examples/WiFiProv)
- The `WiFiProv.beginProvision` function includes a boolean parameter, `reset_provisioned`, which determines whether to reset previously stored Wi-Fi credentials before initializing provisioning. This feature addresses issues where the ESP32 may automatically reconnect to a previously connected Wi-Fi network, making it undiscoverable for new provisioning
    - If reset_provisioned is set to false:
        - The ESP32 attempts to reconnect to the last saved Wi-Fi network without requiring new provisioning.
        - Once reconnected, the ESP32 retrieves its last saved device ID and continues sending updates to Firebase Realtime Database.
        - This configuration is ideal for scenarios where the ESP32 needs to maintain persistent Wi-Fi connectivity, even after power loss or disconnection.
    - If reset_provisioned is set to true:
        - The ESP32 clears all previously stored Wi-Fi credentials and requests new provisioning on every startup.
        - A new device ID is also generated during the provisioning process.
        - This setting is particularly useful for testing or simulating scenarios where new devices are being added and connected to Wi-Fi for the first time.

**Firebase ESP Client:**
- Use this link for more information about this library: https://github.com/rolan37/Firebase-ESP-Client-main

**SimpleBLE:**
- When the ESP32 is already connected to Wi-Fi, SimpleBLE is used to broadcast a BLE signal, making the device discoverable by our mobile app. This allows the app to send a new user's UID through a POST request to the ESP32.
- However, broadcasting a BLE signal continuously can consume significant memory and processing power on the ESP32, which may affect its performance. To address this limitation, we implemented an alternative method for discoverability using mDNS.

**mDNS:**
- As an alternative to BLE, we implemented mDNS (Multicast DNS), which allows the ESP32 to be discoverable via a custom hostname on the local network. This enables API calls using the hostname instead of relying on a dynamic or static IP address.
- When the mobile app and ESP32 are connected to the same network, the app can send the user's UID to the ESP32 via HTTP. The ESP32 then updates the Firebase Realtime Database with the new user's information. This approach minimizes memory usage compared to continuous BLE broadcasting while maintaining discoverability.
  
**Stochastic Algorithm Filter**
- The stochastic algorithm incorporated in the function manageWaterHeaterLoad(float ft) function uses probabilistic decision-making to control the water heater's state (on or off) based on grid frequency conditions.
    This function manages the water heater's load by considering:
    - The current grid frequency (ft).
    - Randomness to make decisions probabilistically.
    - The state of the water heater and external factors like scheduled off periods.
    
- The function controlWaterHeater executes the decision made by manageWaterHeaterLoad by:
    - Turning the heater on or off.
    - Updating the Firebase Realtime Database (RTDB) with the current status.

Note: This sketch takes up a lot of space for the app and may not be able to flash with default setting on some chips.
  If you see Error like this: "Sketch too big"
  In Arduino IDE go to: Tools > Partition scheme > chose anything that has more than 1.4MB APP
  - Tools > Partition scheme > Huge APP
  - Tools > Flash mode > to QIO
   
     
