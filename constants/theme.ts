/**
 * Suelo Coffee Shop - Elegant Coffee Palette
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Primary: Deep Espresso / Dark Earth (Suelo)
    primary: '#3E2723', 
    primaryLight: '#5D4037',
    primaryDark: '#1B1212',
    
    // Accent: Warm Latte / Clay
    accent: '#D7CCC8', 
    accentLight: '#F5F5F5',
    accentDark: '#A1887F',
    
    // Background colors
    background: '#FDFBF7', // Very light warm paper
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F1E8', // Light beige
    
    // Text colors
    text: '#2D2D2D',
    textSecondary: '#795548', // Brown-ish grey
    textLight: '#9B9B9B',
    
    // Status colors
    success: '#5D4037',
    warning: '#A1887F',
    error: '#C85A3A',
    
    // UI elements
    tint: '#3E2723',
    icon: '#795548',
    tabIconDefault: '#D7CCC8',
    tabIconSelected: '#3E2723',
    
    // Star/Reward colors
    star: '#3E2723', // Dark star
    starBackground: '#D7CCC8', // Light background
    
    // Badge colors
    badge: '#FFFFFF', // White icon on primary
    
    // Coffee colors
    coffee: '#3E2723',
    coffeeLight: '#5D4037',
    
    // Border/Divider
    border: '#EFEBE9',
    divider: '#EFEBE9',
  },
  dark: {
    // Primary colors
    primary: '#D7CCC8', // Light Earth/Latte for dark mode contrast
    primaryLight: '#F5F5F5',
    primaryDark: '#A1887F',
    
    // Accent colors
    accent: '#5D4037',
    accentLight: '#8D6E63',
    accentDark: '#3E2723',
    
    // Background colors
    background: '#1B1212', // Deep Espresso Black
    surface: '#2C2C2C',
    surfaceSecondary: '#3E2723',
    
    // Text colors
    text: '#F5F5F5',
    textSecondary: '#D7CCC8',
    textLight: '#A1887F',
    
    // Status colors
    success: '#8D6E63',
    warning: '#D7CCC8',
    error: '#E87A5A',
    
    // UI elements
    tint: '#D7CCC8',
    icon: '#A1887F',
    tabIconDefault: '#5D4037',
    tabIconSelected: '#D7CCC8',
    
    // Star/Reward colors
    star: '#D7CCC8',
    starBackground: '#3E2723',

    // Badge colors
    badge: '#1B1212',
    
    // Coffee colors
    coffee: '#A1887F',
    coffeeLight: '#BCAAA4',
    
    // Border/Divider
    border: '#3E2723',
    divider: '#3E2723',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
