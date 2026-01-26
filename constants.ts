import { IconSpec } from './types';

export const IOS_APP_ICON_SPECS: IconSpec[] = [
  // iPhone
  { size: 20, scale: 2, idiom: 'iphone', label: 'iPhone Notification (20pt @2x)' },
  { size: 20, scale: 3, idiom: 'iphone', label: 'iPhone Notification (20pt @3x)' },
  { size: 29, scale: 2, idiom: 'iphone', label: 'iPhone Settings (29pt @2x)' },
  { size: 29, scale: 3, idiom: 'iphone', label: 'iPhone Settings (29pt @3x)' },
  { size: 40, scale: 2, idiom: 'iphone', label: 'iPhone Spotlight (40pt @2x)' },
  { size: 40, scale: 3, idiom: 'iphone', label: 'iPhone Spotlight (40pt @3x)' },
  { size: 60, scale: 2, idiom: 'iphone', label: 'iPhone App (60pt @2x)' },
  { size: 60, scale: 3, idiom: 'iphone', label: 'iPhone App (60pt @3x)' },
  // iPad
  { size: 20, scale: 1, idiom: 'ipad', label: 'iPad Notification (20pt @1x)' },
  { size: 20, scale: 2, idiom: 'ipad', label: 'iPad Notification (20pt @2x)' },
  { size: 29, scale: 1, idiom: 'ipad', label: 'iPad Settings (29pt @1x)' },
  { size: 29, scale: 2, idiom: 'ipad', label: 'iPad Settings (29pt @2x)' },
  { size: 40, scale: 1, idiom: 'ipad', label: 'iPad Spotlight (40pt @1x)' },
  { size: 40, scale: 2, idiom: 'ipad', label: 'iPad Spotlight (40pt @2x)' },
  { size: 76, scale: 1, idiom: 'ipad', label: 'iPad App (76pt @1x)' },
  { size: 76, scale: 2, idiom: 'ipad', label: 'iPad App (76pt @2x)' },
  { size: 83.5, scale: 2, idiom: 'ipad', label: 'iPad Pro App (83.5pt @2x)' },
  // Marketing
  { size: 1024, scale: 1, idiom: 'ios-marketing', label: 'App Store (1024pt)' },
];

export const MACOS_APP_ICON_SPECS: IconSpec[] = [
  { size: 16, scale: 1, idiom: 'mac', label: 'Mac 16pt' },
  { size: 16, scale: 2, idiom: 'mac', label: 'Mac 16pt @2x' },
  { size: 32, scale: 1, idiom: 'mac', label: 'Mac 32pt' },
  { size: 32, scale: 2, idiom: 'mac', label: 'Mac 32pt @2x' },
  { size: 128, scale: 1, idiom: 'mac', label: 'Mac 128pt' },
  { size: 128, scale: 2, idiom: 'mac', label: 'Mac 128pt @2x' },
  { size: 256, scale: 1, idiom: 'mac', label: 'Mac 256pt' },
  { size: 256, scale: 2, idiom: 'mac', label: 'Mac 256pt @2x' },
  { size: 512, scale: 1, idiom: 'mac', label: 'Mac 512pt' },
  { size: 512, scale: 2, idiom: 'mac', label: 'Mac 512pt @2x' },
];

export const IMAGE_SET_SPECS: IconSpec[] = [
  { size: 0, scale: 1, idiom: 'universal', label: '1x' }, // Size 0 implies dynamic calculation
  { size: 0, scale: 2, idiom: 'universal', label: '2x' },
  { size: 0, scale: 3, idiom: 'universal', label: '3x' },
];

export const ANDROID_ICON_SPECS: IconSpec[] = [
  { size: 48, scale: 1, idiom: 'android', label: 'MDPI (48x48)', filename: 'res/mipmap-mdpi/ic_launcher.png' },
  { size: 72, scale: 1, idiom: 'android', label: 'HDPI (72x72)', filename: 'res/mipmap-hdpi/ic_launcher.png' },
  { size: 96, scale: 1, idiom: 'android', label: 'XHDPI (96x96)', filename: 'res/mipmap-xhdpi/ic_launcher.png' },
  { size: 144, scale: 1, idiom: 'android', label: 'XXHDPI (144x144)', filename: 'res/mipmap-xxhdpi/ic_launcher.png' },
  { size: 192, scale: 1, idiom: 'android', label: 'XXXHDPI (192x192)', filename: 'res/mipmap-xxxhdpi/ic_launcher.png' },
  { size: 512, scale: 1, idiom: 'android', label: 'Play Store (512x512)', filename: 'play_store_512.png' },
];