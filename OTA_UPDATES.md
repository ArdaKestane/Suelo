# Over-The-Air (OTA) Updates Guide

## Overview

This project is configured with EAS Update for over-the-air updates. This allows you to push JavaScript and asset updates to your app without rebuilding and resubmitting to app stores.

## Update Channels

- **`preview`**: For testing and internal distribution
- **`production`**: For production releases

## How It Works

1. **Builds** are linked to channels via `eas.json`
2. **Updates** are published to channels
3. **Apps** check for updates on the channel they were built with
4. **Updates** are downloaded and applied automatically

## Automated Workflows

### Preview Updates
- **Trigger**: Push to `develop` or `preview` branches
- **Workflow**: `.github/workflows/update-preview.yml`
- **Channel**: `preview`
- **Manual**: Run workflow from GitHub Actions UI

### Production Updates
- **Trigger**: Push to `main` or `master` branches
- **Workflow**: `.github/workflows/update-production.yml`
- **Channel**: `production`
- **Manual**: Run workflow from GitHub Actions UI

## Manual Update Publishing

### Preview Channel
```bash
eas update --channel preview --message "Your update message"
```

### Production Channel
```bash
eas update --channel production --message "Your update message"
```

**Alternative (using --auto):**
```bash
# Automatically uses channel from build profile
eas update --auto --message "Your update message"
```

## Runtime Version

The app uses `runtimeVersion: { policy: "appVersion" }`, which means:
- Updates are tied to the app version in `app.json`
- When you change `version`, you need a new build
- Updates can only be applied to apps with the same runtime version

## Update Limitations

**What CAN be updated via OTA:**
- JavaScript/TypeScript code
- Assets (images, fonts, etc.)
- React Native code
- Expo SDK updates (within same major version)

**What CANNOT be updated via OTA:**
- Native code changes
- New native dependencies
- App version changes
- Bundle identifier/package name
- Permissions changes
- New Expo plugins

For these changes, you need to create a new build.

## Workflow Integration

### Preview Build + Update
When a preview build completes, an update is automatically published to the `preview` channel.

### Production Build + Update
When a production build is created from a tag, an update is automatically published to the `production` channel.

## Checking Update Status

View updates at: https://expo.dev/accounts/ardakestane/projects/suelo/updates

## Testing Updates

1. Build app with a specific channel:
   ```bash
   eas build --profile preview --platform ios
   ```

2. Install the build on your device

3. Make code changes and publish update:
   ```bash
   eas update --channel preview
   ```

4. Open the app - it should automatically download and apply the update

## Rollback

To rollback an update:
```bash
eas update:rollback --channel <channel>
```

## Best Practices

1. **Test updates in preview** before publishing to production
2. **Use meaningful update messages** for tracking
3. **Monitor update adoption** in EAS dashboard
4. **Version your app** when making native changes
5. **Use branches** to separate preview and production updates

## GitHub Secrets Required

- `EXPO_TOKEN`: Your Expo access token
  - Generate at: https://expo.dev/accounts/ardakestane/settings/access-tokens
  - Add to GitHub: Settings → Secrets and variables → Actions

## Update Dashboard

Monitor all updates at:
https://expo.dev/accounts/ardakestane/projects/suelo/updates
