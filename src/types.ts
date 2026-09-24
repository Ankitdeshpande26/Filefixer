export type ToolId = 
  | 'compress-image' 
  | 'resize-image' 
  | 'jpg-to-pdf' 
  | 'compress-pdf' 
  | 'image-to-pdf' 
  | 'merge-pdf';

export interface ToolMeta {
  id: ToolId;
  path: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  iconName: string;
  acceptedFormats: string;
  badge?: string;
  color: string;
  popular?: boolean;
}

export interface CompressedImageResult {
  id: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercent: number;
  originalUrl: string;
  compressedUrl: string;
  blob: Blob;
  width: number;
  height: number;
  format: string;
  name: string;
  isAlreadyOptimal?: boolean;
  statusMessage?: string;
}

export interface ImageItemForPdf {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
}

export interface PdfMergeItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export interface PdfCompressionResult {
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercent: number;
  pageCount: number;
  originalName: string;
  compressedBlob: Blob;
  compressedUrl: string;
  compressionLevel: 'extreme' | 'balanced' | 'light';
  isAlreadyOptimal?: boolean;
  imagesOptimized?: number;
  statusMessage?: string;
}

export interface PricingPlan {
  id: 'free' | 'starter' | 'pro' | 'business';
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  ctaText: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

