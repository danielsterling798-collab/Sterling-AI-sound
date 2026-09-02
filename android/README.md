# Sterling AI Sound v4 Android App

## Overview
Sterling AI Sound v4 is an advanced audio enhancement application for Android with intelligent sound tuning capabilities.

**Package Name:** `com.danielsterling.sterlingsoundaiv4`  
**Version Code:** 4  
**Version Name:** 1.0.2-PROD  
**Min SDK:** API 24 (Android 7.0)  
**Target SDK:** API 34 (Android 14)  

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/danielsterling/sterlingsoundaiv4/
│   │   │   │   └── MainActivity.java
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   └── activity_main.xml
│   │   │   │   └── values/
│   │   │   │       ├── colors.xml
│   │   │   │       ├── strings.xml
│   │   │   │       └── styles.xml
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── gradle.properties
└── settings.gradle
```

## Build Instructions

### Prerequisites
- Android SDK 34 (Android 14)
- Java 11 or higher
- Gradle 8.0+

### Build Release Bundle

1. Clone the repository:
```bash
git clone https://github.com/danielsterling798-collab/Sterling-AI-sound.git
cd Sterling-AI-sound
```

2. Navigate to Android directory:
```bash
cd android
```

3. Build the release bundle:
```bash
./gradlew clean bundleRelease
```

4. The signed release bundle will be at:
```
app/build/outputs/bundle/release/app-release.aab
```

## Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select **Sterling AI Sound 4**
3. Navigate to **Release** → **Production**
4. Click **Create new release**
5. Upload `app/build/outputs/bundle/release/app-release.aab`
6. Fill in release notes and submit for review

## Signing Configuration

Set environment variables for signing:
```bash
export KEYSTORE_FILE=/path/to/sterling-sound-upload-key.jks
export KEYSTORE_PASSWORD=your-password
export KEY_ALIAS=upload
export KEY_PASSWORD=your-key-password
```

## Features
- Advanced audio enhancement
- Real-time sound processing
- Audio recording capabilities
- Network connectivity for cloud features
- Full Material Design UI

## Permissions
- `INTERNET` - Cloud connectivity
- `ACCESS_NETWORK_STATE` - Network monitoring
- `RECORD_AUDIO` - Audio recording
- `MODIFY_AUDIO_SETTINGS` - Audio control

## License
All rights reserved © Daniel Sterling

## Support
For issues or questions, contact: danielsterling798@gmail.com
