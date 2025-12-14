# Deploying Suelo to Physical Device

## Prerequisites
- EAS CLI installed (already installed: `eas-cli@16.28.0`)
- Expo account (owner: ardakestane)
- EAS project configured (projectId: d555dbb0-d228-4f05-a2bf-d3ca46bea47e)

## Quick Start

### Option 1: Development Build (Recommended)
For testing on physical device with hot reload:

```bash
# Install expo-dev-client if not already installed
npm install expo-dev-client

# Build development client
eas build --profile development --platform ios
# or
eas build --profile development --platform android

# After build completes, install the app on your device
# Then start the dev server
npm start
```

### Option 2: Preview Build (Internal Distribution)
For sharing with testers or installing directly:

```bash
# Build preview version
eas build --profile preview --platform ios
# or
eas build --profile preview --platform android

# Download and install the .ipa (iOS) or .apk (Android) file
```

### Option 3: Production Build
For App Store / Play Store submission:

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## Using Expo Go (Limited - Not Recommended)
Since this project uses native modules (reanimated, svg, etc.), Expo Go may not work properly. Use development builds instead.

## Build Status
Check build status at: https://expo.dev/accounts/ardakestane/projects/suelo/builds

## Installation on Device

### iOS
1. After build completes, download the .ipa file
2. Install via TestFlight (if using internal distribution) or directly via EAS
3. Trust the developer certificate in Settings > General > VPN & Device Management

### Android
1. After build completes, download the .apk file
2. Enable "Install from Unknown Sources" in Settings
3. Install the .apk file directly

## Development Workflow
1. Make code changes
2. Run `npm start` to start dev server
3. Open the development build app on your device
4. Shake device or use dev menu to reload

## Over-The-Air (OTA) Updates

This project is configured with EAS Update for OTA updates. See [OTA_UPDATES.md](./OTA_UPDATES.md) for complete documentation.

## Local Build Commands

### iOS Builds

#### Workflow Example

1. **Initial Build for TestFlight:**
   ```bash
   eas build --platform ios --profile preview
   ```
   - This build listens to the "preview" channel
   - Submit to TestFlight

2. **Make JavaScript/UI Changes:**
   - Edit your code (no native changes)
   - Test locally

3. **Publish OTA Update:**
   ```bash
   npm run update:preview
   ```
   - TestFlight users get the update automatically on next app launch

4. **For Production (App Store):**
   ```bash
   eas build --platform ios --profile production
   npm run update:production
   ```

#### Important Notes

- **OTA updates only work for JavaScript and asset changes**
- **Native code changes** (new plugins, native modules, etc.) still require a new build
- The app automatically checks for updates on launch
- Updates are applied seamlessly in the background

### Automated Updates

- **Preview**: Updates automatically published when pushing to `develop` or `preview` branches
- **Production**: Updates automatically published when pushing to `main` or `master` branches

View updates at: https://expo.dev/accounts/ardakestane/projects/suelo/updates

