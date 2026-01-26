export type Scale = '1x' | '2x' | '3x';
export type Idiom = 'iphone' | 'ipad' | 'ios-marketing' | 'mac' | 'universal' | 'watch' | 'watch-marketing' | 'android';

export interface IconSpec {
  size: number;
  scale: number;
  idiom: Idiom;
  filename?: string; // Generated filename or predefined path
  label?: string; // For UI display
}

export interface ImageSetSpec {
  scale: Scale;
  idiom: Idiom;
}

export interface AssetGeneratorConfig {
  type: 'ios' | 'macos' | 'imageset' | 'android';
  name: string;
}

export interface ProcessedImage {
  spec: IconSpec;
  blob: Blob;
  url: string;
  name: string;
}

export interface ContentsJsonImage {
  size?: string;
  idiom: Idiom;
  filename: string;
  scale: string;
  role?: string;
  subtype?: string;
}

export interface ContentsJson {
  images: ContentsJsonImage[];
  info: {
    version: number;
    author: string;
  };
}