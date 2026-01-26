import { ContentsJson, ContentsJsonImage, IconSpec, ProcessedImage } from '../types';
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';

// Helper to load image
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Helper to resize image using canvas
const resizeImage = async (
  img: HTMLImageElement,
  width: number,
  height: number,
  format: 'png' | 'jpg' = 'png'
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // High quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  const srcAspect = img.width / img.height;
  const destAspect = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (srcAspect > destAspect) {
    // Source is wider, crop sides
    drawHeight = height;
    drawWidth = height * srcAspect;
    offsetX = (width - drawWidth) / 2;
  } else {
    // Source is taller, crop top/bottom
    drawWidth = width;
    drawHeight = width / srcAspect;
    offsetY = (height - drawHeight) / 2;
  }

  // Draw the image centered
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas to Blob failed'));
    }, `image/${format}`);
  });
};

export const generateAssets = async (
  file: File,
  specs: IconSpec[],
  type: 'ios' | 'macos' | 'imageset' | 'android',
  assetName: string = 'AppIcon'
): Promise<ProcessedImage[]> => {
  const img = await loadImage(file);
  const processed: ProcessedImage[] = [];
  const baseWidth = img.width;
  const baseHeight = img.height;

  for (const spec of specs) {
    let targetWidth: number;
    let targetHeight: number;
    let filename: string;

    if (type === 'imageset') {
      // For Image Sets, we assume the input is the 3x version (highest quality)
      const scaleFactor = spec.scale / 3; 
      targetWidth = Math.round(baseWidth * scaleFactor);
      targetHeight = Math.round(baseHeight * scaleFactor);
      
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
      const ext = file.name.split('.').pop() || 'png';
      
      if (spec.scale === 1) filename = `${cleanName}.${ext}`;
      else filename = `${cleanName}@${spec.scale}x.${ext}`;

    } else if (type === 'android') {
       // Android Icons
       targetWidth = spec.size;
       targetHeight = spec.size;
       filename = spec.filename || `ic_launcher_${spec.size}.png`;
    } else {
      // For App Icons (iOS/macOS)
      targetWidth = spec.size * spec.scale;
      targetHeight = spec.size * spec.scale;
      filename = `Icon-${spec.idiom}-${spec.size}x${spec.size}@${spec.scale}x.png`;
      if (spec.scale === 1) {
         if (spec.idiom === 'ios-marketing') filename = 'iTunesArtwork@2x.png'; 
      }
    }

    const blob = await resizeImage(img, targetWidth, targetHeight, 'png');
    processed.push({
      spec: { ...spec, filename },
      blob,
      url: URL.createObjectURL(blob),
      name: filename
    });
  }

  return processed;
};

export const createContentsJson = (processedImages: ProcessedImage[], type: 'ios' | 'macos' | 'imageset' | 'android'): string => {
  if (type === 'android') return ""; // Android doesn't use Contents.json

  const images: ContentsJsonImage[] = processedImages.map(item => {
    const entry: ContentsJsonImage = {
      idiom: item.spec.idiom,
      filename: item.name,
      scale: `${item.spec.scale}x`
    };

    if (type !== 'imageset') {
        entry.size = `${item.spec.size}x${item.spec.size}`;
    }

    return entry;
  });

  const json: ContentsJson = {
    images,
    info: {
      version: 1,
      author: "xcode"
    }
  };

  return JSON.stringify(json, null, 2);
};

export const downloadZip = async (processedImages: ProcessedImage[], type: 'ios' | 'macos' | 'imageset' | 'android') => {
  const zip = new JSZip();
  
  // Create folder structure
  let folderName = 'AppIcon.appiconset';
  if (type === 'imageset') folderName = 'Assets.imageset';
  if (type === 'android') folderName = 'Android_Assets';

  const folder = zip.folder(folderName);

  if (!folder) return;

  // Add images
  processedImages.forEach(img => {
    // For Android, filename includes path (e.g., res/mipmap-hdpi/ic_launcher.png)
    // JSZip handles paths automatically
    folder.file(img.name, img.blob);
  });

  // Add Contents.json only if not android
  if (type !== 'android') {
    const jsonContent = createContentsJson(processedImages, type);
    folder.file('Contents.json', jsonContent);
  }

  // Generate zip
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Fix for file-saver import issues with esm.sh
  // Use explicit casting to handle both CommonJS/Module behaviors
  const save = (FileSaver as any).saveAs || (FileSaver as any).default || FileSaver;
  save(content, `${folderName}.zip`);
};