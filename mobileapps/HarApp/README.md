# Sugarcane Harvester Consignment App

## Introduction

The Sugarcane Harvester Consignment App, a part of The Kodapops Capstone project at Queensland University of Technology (QUT), is designed to revolutionise the harvester consignment process for sugar cane farmers and contractors. Developed with the Expo framework, this app delivers a seamless experience across both iOS and Android platforms.

## Prerequisites

Before starting, ensure you have installed:

- Node.js (LTS version recommended)
- npm (Node Package Manager)
- Expo CLI by running `npm install -g expo-cli` in your terminal.
- Expo Go app on your mobile device for testing, available in the Apple App Store and Google Play Store.

## Getting Started

1. **Clone the Repository**

   Clone the project repository to your machine:

   ```sh
   git clone https://github.com/raychuuse/TheKodapopsCapstone.git
   ```

2. **Navigate to the App Directory**

   Change into the directory where the Sugar Kane Harvester Consignment App is located:

   ```sh
   cd TheKodapopsCapstone/mobileapps/HarApp
   ```

3. **Install Dependencies**

   Install the required dependencies:

   ```sh
   npm install
   ```

4. **Install Dependencies**

   Install the required dependencies in expo:

   ```sh
   npx expo install
   ```

5. **Start the Development Server**

   Launch the Expo development server:

   ```sh
   npm run start
   ```

   This command opens the runs the Expo server for you to connect to using Expo Go App either on a physical or emulated device.

## Running the App in Expo Go

To run the app on your mobile device with Expo Go:

1. Ensure your computer and mobile device are on the same Wi-Fi network.
2. Open the Expo Go app on your device.
3. Scan the QR code from the Expo developer server in your devices camera.

The app will load on your device for real-time testing.

## Running the App on Emulators

### Setting up and Running on Android Emulator

1. **Install Android Studio**

   Download and install Android Studio. During installation, ensure that the Android Virtual Device (AVD) is included in the setup.

2. **Create a Virtual Device**

   Open Android Studio, go to the AVD Manager, and create a new Android Virtual Device. Choose a device definition and a system image (e.g., a recent version of Android).

3. **Install Expo Go on the Android Emulator**

   Start the created Android Virtual Device. Open the Google Play Store within the emulator, sign in with a Google account, and search for "Expo Go". Install the Expo Go app.

4. **Enter the URL in Expo Go**

   Open the Expo Go app on your emulator. Use the "Explore" tab to enter the URL manually. This connects the emulator to your development server and loads the app.

### Setting up and Running on iOS Simulator (macOS only)

1.  **Install Xcode**

    Download and install Xcode from the Mac App Store. Ensure that it includes the iOS Simulator.

2.  **Start iOS Simulator**

    Open Xcode, go to the Xcode menu, select "Open Developer Tool", then choose "Simulator". Start your preferred iOS Simulator.

3.  **Install Expo Go on the iOS Simulator**

    In the Simulator, open Safari, navigate to `expo.io/tools`, and download the Expo Go app for iOS. The simulator will prompt to install it once the download is complete.

4.  **Enter the URL in Expo Go**

    Open the Expo Go app on your simulator. Use the "Explore" tab to enter the URL manually. This connects the simulator to your development server and loads the app.

## Performing a Final Build

For a final build:

1. **iOS Build**

   ```sh
   npx expo build:ios
   ```

   An Apple Developer account and mac is required

2. **Android Build**

   ```sh
   npx expo build:android
   ```

Choose `.apk` for Android package or `.aab` for an Android App Bundle.

## Support and Inquiries

For support or inquiries regarding this closed capstone project, contact:

- Andrew Wilks, Student Number: n10768009
- Email: n10768009@qut.edu.au or me@andrewwilks.au
- Website: [www.andrewwilks.au](http://www.andrewwilks.au)

## Contributing

This project is closed and part of a university capstone, with contributions limited to project members.

## License

This project is proprietary. Unauthorized distribution or copying is strictly prohibited.
