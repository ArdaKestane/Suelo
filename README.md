# Suelo - Coffee Shop App

A modern React Native coffee shop application built with Expo.

## Features

- 🏠 **Home**: Featured products and promotions
- 📖 **Menu**: Browse coffee products with filters (Hot, Cold, Spicy, Seasonal)
- 📱 **QR Code**: Scan QR codes for quick access
- 🗺️ **Stores**: Find nearby locations with map view
- 👤 **Profile**: Track your coffee consumption and favorites

## Tech Stack

- **Framework**: Expo Router (file-based routing)
- **UI**: React Native with custom components
- **Icons**: Iconoir React Native
- **Animations**: React Native Reanimated
- **Build**: EAS Build
- **Updates**: EAS Update (OTA)

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm or yarn
- Expo CLI or EAS CLI

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

### Development

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Building for Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed build and deployment instructions.

## Over-The-Air Updates

This project uses EAS Update for OTA updates. See [OTA_UPDATES.md](./OTA_UPDATES.md) for complete documentation.

## Project Structure

```
app/
  (tabs)/          # Tab navigation screens
  product/         # Product detail pages
components/        # Reusable components
  CustomTabBar.tsx # Custom bottom navigation
constants/         # Theme and constants
assets/            # Images and icons
```

## License

Private project
