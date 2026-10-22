# How to Build, Export and Install the SN Downloader APK

This guide provides instructions to compile, sign, export, and install the **SN Downloader (Shani Noumi Downloader)** native Android APK on real Android devices.

---

## Prerequisites

1. **Android Studio**: Version Hedgehog (2023.1.1) or Ladybug (2024.2+) recommended.
2. **Java Development Kit (JDK)**: JDK 17 or JDK 21.
3. **Android SDK**: API 34 (Android 14) with Build-Tools 34.0.0.
4. **Target Devices**: Android 8.0 (API 26) through Android 15+.

---

## Step 1: Open the Project in Android Studio

1. Launch Android Studio.
2. Select **File > Open...** and navigate to the `android/` directory of this repository.
3. Click **OK**.
4. Allow Gradle to automatically sync plugins and dependencies (Jetpack Compose, Material 3, OkHttp, Coil).

---

## Step 2: Build Debug APK for Testing

To quickly test the app on an Android emulator or a physical phone connected via USB:

```bash
cd android
./gradlew assembleDebug
```

On Windows:
```cmd
cd android
gradlew.bat assembleDebug
```

The debug APK will be created at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 3: Generate Signed Release APK

For production distribution:

### 3.1 Generate a Keystore (if you don't already have one)
```bash
keytool -genkey -v -keystore sndownloader.keystore -alias sndownloader \
  -keyalg RSA -keysize 2048 -validity 10000
```

### 3.2 Build the Release APK
```bash
./gradlew assembleRelease
```
The unsigned release APK will be generated at:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 3.3 Align and Sign the APK using `zipalign` & `apksigner`
```bash
# 1. Zipalign the package
zipalign -v -p 4 android/app/build/outputs/apk/release/app-release-unsigned.apk SNDownloader_v2.4_aligned.apk

# 2. Sign with your keystore
apksigner sign --ks sndownloader.keystore --out SNDownloader_v2.4.apk SNDownloader_v2.4_aligned.apk

# 3. Verify signature
apksigner verify SNDownloader_v2.4.apk
```

---

## Step 4: Install on Device

### Option A: Using ADB (Android Debug Bridge)
1. Enable **Developer Options** and **USB Debugging** on your phone.
2. Connect your device via USB.
3. Run:
```bash
adb install -r SNDownloader_v2.4.apk
```

### Option B: Direct File Transfer
1. Send `SNDownloader_v2.4.apk` to your phone via WhatsApp, Google Drive, or Telegram.
2. Tap the APK file on your device.
3. Allow **Install from unknown sources** when prompted.
4. Tap **Install** and enjoy **SN Downloader**!

---

## Troubleshooting Common Build Issues

- **JDK Version Mismatch**: In Android Studio, go to **Settings > Build, Execution, Deployment > Build Tools > Gradle** and ensure Gradle JDK is set to **Embedded JDK 17** or higher.
- **Compose Compiler Warning**: The project uses Kotlin `1.9.22` with Compose Compiler `1.5.8`. If upgrading Kotlin to `2.0+`, update the Compose Compiler plugin accordingly.
- **WhatsApp Support Intent**: Ensure the user has WhatsApp installed; if not, the app will automatically open `https://wa.me/923288501635` in the default browser.
