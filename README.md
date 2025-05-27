# AI License Plate Extractor (React Native)

This React Native application allows users to capture an image of a vehicle's license plate using the device camera, send the image to the Gemini API for text extraction, and view a history of scanned plates.

## Features

*   **Image Capture**: Uses the device camera to take photos.
*   **License Plate Extraction**: Integrates with the Gemini API to extract license plate numbers from images.
*   **History**: Stores and displays a list of previously scanned license plates.
*   **Cross-Platform (Android focused)**: Built with React Native, currently optimized and tested for Android.

## Project Structure

```
AiNumberPlateExtraction/
├── android/                  # Android native project files
├── ios/                      # iOS native project files (not fully configured for this project)
├── src/
│   ├── api/
│   │   └── geminiApi.js      # Gemini API integration
│   ├── components/
│   │   ├── CameraView.js     # Handles image capture (using react-native-image-picker)
│   │   ├── PlateHistoryItem.js # Renders individual history items
│   │   └── PlateResult.js    # Displays captured image and extracted text
│   ├── navigation/
│   │   └── AppNavigator.js   # Stack navigator for app screens
│   ├── screens/
│   │   ├── HomeScreen.js     # Main screen with camera access and navigation
│   │   ├── ResultScreen.js   # Displays extraction result and save option
│   │   └── HistoryScreen.js  # Shows list of saved license plates
│   ├── utils/
│   │   ├── apiConfig.js      # API key configuration
│   │   ├── permissions.js    # Permission handling (delegated to image picker)
│   │   └── storage.js        # AsyncStorage utility for history
├── .env                      # Environment variables (API_KEY)
├── .gitignore
├── App.tsx                   # Main App component
├── babel.config.js
├── index.js                  # Entry point
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: LTS version (e.g., 18.x or 20.x). You can use [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to manage Node versions.
*   **Watchman**: A file watching service. Install via Homebrew on macOS: `brew install watchman`
*   **Java Development Kit (JDK)**: Version 11 or 17 is recommended.
*   **Android Studio**:
    *   Install Android Studio ([download here](https://developer.android.com/studio)).
    *   Ensure you have the Android SDK installed (typically comes with Android Studio).
    *   Set up an Android Virtual Device (AVD) or connect a physical Android device for testing.
    *   Make sure `ANDROID_HOME` environment variable is set. Add the following lines to your `~/.zshrc` or `~/.bashrc` file:
        ```bash
        export ANDROID_HOME=$HOME/Library/Android/sdk
        export PATH=$PATH:$ANDROID_HOME/emulator
        export PATH=$PATH:$ANDROID_HOME/tools
        export PATH=$PATH:$ANDROID_HOME/tools/bin
        export PATH=$PATH:$ANDROID_HOME/platform-tools
        ```
        Then run `source ~/.zshrc` or `source ~/.bashrc`.

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Danush-dx/ai-numberplate-extraction.git
    cd ai-numberplate-extraction
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Configure API Key:**
    *   Create a `.env` file in the root of the project (`AiNumberPlateExtraction/.env`).
    *   Add your Gemini API key to this file:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    *   **Important**: Ensure `.env` is listed in your `.gitignore` file to prevent your API key from being committed to version control. (It should already be there from the project setup).

## Running the Application (Android)

1.  **Start the Metro Bundler:**
    Open a terminal in the project root (`AiNumberPlateExtraction/`) and run:
    ```bash
    npm start -- --reset-cache
    # or
    # yarn start --reset-cache
    ```
    Keep this terminal window open.

2.  **Run on Android Device/Emulator:**
    Open another terminal in the project root and run:
    ```bash
    npm run android
    # or
    # yarn android
    ```
    This will build the app and install it on your connected Android device or an active emulator.

    If you encounter issues, ensure your Android device is properly connected (check with `adb devices`) or that your emulator is running.

## Usage

1.  Launch the app on your Android device/emulator.
2.  The home screen will provide an option to "Scan License Plate".
3.  Tapping this will open the device camera.
4.  Take a photo of a license plate.
5.  The app will send the image to the Gemini API.
6.  The result (extracted plate number and the image) will be displayed.
7.  You can choose to "Save to History" or "Scan Another Plate".
8.  Access the "View History" screen from the home page to see all saved plates. You can delete individual entries or clear the entire history.

## Troubleshooting

*   **`EADDRINUSE` error for Metro:**
    If you see an error like "address already in use" for port 8081, it means another process is using it. Find and kill the process:
    ```bash
    sudo lsof -i :8081 # Find the PID
    kill -9 <PID>
    ```
*   **Camera not opening / App crashing on image capture:**
    *   Ensure all permissions (`CAMERA`, `READ_EXTERNAL_STORAGE`/`READ_MEDIA_IMAGES`) are correctly added in `AndroidManifest.xml`.
    *   The `FileProvider` paths in `file_paths.xml` and `AndroidManifest.xml` must be correctly configured for `react-native-image-picker`.
*   **API Errors:**
    *   Double-check your `API_KEY` in the `.env` file.
    *   Ensure your Gemini API key is valid and has the "Generative Language API" enabled in your Google Cloud project.
    *   Check the console logs in Metro bundler or Android Studio Logcat for specific error messages from the API.
*   **Build Fails (`compileSdkVersion`, etc.):**
    *   Ensure your `android/build.gradle` has compatible `compileSdkVersion`, `targetSdkVersion`, and Gradle plugin versions.
    *   Clean the Android build: `cd android && ./gradlew clean && cd ..` then try rebuilding.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
