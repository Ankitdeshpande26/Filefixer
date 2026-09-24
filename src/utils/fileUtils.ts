import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { PDFDocument, PDFName, PDFNumber, PDFRawStream } from 'pdf-lib';
import { CompressedImageResult, ImageItemForPdf, PdfCompressionResult } from '../types';

/**
 * Formats bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  if (isNaN(bytes) || bytes < 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i] || 'MB'}`;
}

/**
 * Triggers a browser download for a Blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Fires celebratory confetti
 */
export function fireCelebration(): void {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
    });
  } catch {
    // Ignore if canvas-confetti is not available
  }
}

/**
 * Loads an image into an HTMLImageElement asynchronously
 */
export function loadImage(src: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl: string | null = null;

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (e) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image file. File might be corrupted or in an unsupported format.'));
    };

    if (typeof src === 'string') {
      img.src = src;
    } else {
      objectUrl = URL.createObjectURL(src);
      img.src = objectUrl;
    }
  });
}

/**
 * Compresses an image file directly in the browser canvas
 */
export async function compressImageFile(
  file: File,
  qualityPercent: number, // 1 - 100
  targetFormat?: string,
  maxWidth?: number,
  maxHeight?: number
): Promise<CompressedImageResult> {
  const img = await loadImage(file);
  const originalSize = file.size;

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  // Scale down if maxWidth/maxHeight given
  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext('2d', { alpha: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // Determine target MIME type
  let mimeType = targetFormat;
  if (!mimeType || mimeType === 'original' || mimeType === 'auto') {
    if (file.type === 'image/webp') {
      mimeType = 'image/webp';
    } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      mimeType = 'image/jpeg';
    } else if (file.type === 'image/png') {
      // In Auto mode for PNG, prefer WebP which provides lossy compression with alpha support
      mimeType = 'image/webp';
    } else {
      mimeType = 'image/jpeg';
    }
  }

  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const quality = Math.max(0.05, Math.min(1, qualityPercent / 100));

  let blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to compress image'));
      },
      mimeType,
      quality
    );
  });

  // Verify if compressed blob is actually smaller than original
  let isSmaller = blob.size < originalSize;

  // If not smaller and format was auto/original with PNG, try JPEG if image has white/flat background
  if (!isSmaller && (targetFormat === 'original' || !targetFormat) && mimeType !== 'image/jpeg') {
    const jpegBlob = await new Promise<Blob | null>((resolve) => {
      const jCanvas = document.createElement('canvas');
      jCanvas.width = canvas.width;
      jCanvas.height = canvas.height;
      const jCtx = jCanvas.getContext('2d');
      if (jCtx) {
        jCtx.fillStyle = '#FFFFFF';
        jCtx.fillRect(0, 0, jCanvas.width, jCanvas.height);
        jCtx.drawImage(img, 0, 0, jCanvas.width, jCanvas.height);
        jCanvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
      } else {
        resolve(null);
      }
    });

    if (jpegBlob && jpegBlob.size < originalSize) {
      blob = jpegBlob;
      mimeType = 'image/jpeg';
      isSmaller = true;
    }
  }

  // STRICT RULE:
  // If output < original: return compressed file
  // If output >= original: return original file
  const finalBlob = isSmaller ? blob : file;
  const compressedSize = finalBlob.size; // ALWAYS actualBlob.size
  const isAlreadyOptimal = !isSmaller;
  const savedBytes = isSmaller ? originalSize - compressedSize : 0;
  const savedPercent = isSmaller && originalSize > 0 ? Math.max(0, Math.round((savedBytes / originalSize) * 100)) : 0;

  const originalUrl = URL.createObjectURL(file);
  const compressedUrl = URL.createObjectURL(finalBlob);

  const originalName = file.name;
  const extIndex = originalName.lastIndexOf('.');
  const baseName = extIndex !== -1 ? originalName.substring(0, extIndex) : originalName;
  const ext = isSmaller
    ? mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
    : extIndex !== -1 ? originalName.substring(extIndex + 1) : 'jpg';
  const name = isSmaller ? `${baseName}-compressed.${ext}` : file.name;

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    file,
    originalSize,
    compressedSize,
    savedBytes,
    savedPercent,
    originalUrl,
    compressedUrl,
    blob: finalBlob,
    width: canvas.width,
    height: canvas.height,
    format: ext.toUpperCase(),
    name,
    isAlreadyOptimal,
    statusMessage: isAlreadyOptimal
      ? 'This image is already at optimal compression. The original file has been preserved to avoid increasing the file size.'
      : undefined,
  };
}

/**
 * Resizes an image file
 */
export async function resizeImageFile(
  file: File,
  targetWidth: number,
  targetHeight: number,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  qualityPercent = 90
): Promise<{ blob: Blob; url: string; size: number; width: number; height: number; filename: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));
  const ctx = canvas.getContext('2d', { alpha: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Smooth scaling settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const quality = Math.max(0.1, Math.min(1, qualityPercent / 100));

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to resize image'));
      },
      format,
      quality
    );
  });

  const url = URL.createObjectURL(blob);
  const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
  const originalName = file.name;
  const extIndex = originalName.lastIndexOf('.');
  const baseName = extIndex !== -1 ? originalName.substring(0, extIndex) : originalName;
  const filename = `${baseName}-${canvas.width}x${canvas.height}.${ext}`;

  return {
    blob,
    url,
    size: blob.size,
    width: canvas.width,
    height: canvas.height,
    filename,
  };
}

/**
 * Converts multiple images into a single PDF document using jsPDF
 */
export async function generatePdfFromImages(
  images: ImageItemForPdf[],
  options: {
    pageSize: 'a4' | 'letter' | 'fit';
    orientation: 'auto' | 'portrait' | 'landscape';
    margin: number; // in mm
  }
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('No images provided to generate PDF.');
  }

  // Prepare first page
  const firstItem = images[0];
  const firstImg = await loadImage(firstItem.previewUrl);

  let firstOrientation: 'portrait' | 'landscape' = 'portrait';
  if (options.orientation === 'auto') {
    const isRotated90or270 = firstItem.rotation % 180 !== 0;
    const effectiveWidth = isRotated90or270 ? firstImg.height : firstImg.width;
    const effectiveHeight = isRotated90or270 ? firstImg.width : firstImg.height;
    firstOrientation = effectiveWidth > effectiveHeight ? 'landscape' : 'portrait';
  } else {
    firstOrientation = options.orientation;
  }

  const pdf = new jsPDF({
    orientation: firstOrientation,
    unit: 'mm',
    format: options.pageSize === 'fit' ? 'a4' : options.pageSize,
  });

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const img = await loadImage(item.previewUrl);

    // Apply rotation if needed onto a canvas first
    const canvas = document.createElement('canvas');
    const isRotated90or270 = item.rotation % 180 !== 0;
    const canvasWidth = isRotated90or270 ? img.height : img.width;
    const canvasHeight = isRotated90or270 ? img.width : img.height;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((item.rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
    }

    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.92);

    let pageOrientation: 'portrait' | 'landscape' = 'portrait';
    if (options.orientation === 'auto') {
      pageOrientation = canvasWidth > canvasHeight ? 'landscape' : 'portrait';
    } else {
      pageOrientation = options.orientation;
    }

    if (i > 0) {
      if (options.pageSize === 'fit') {
        // Custom page size matching the image aspect ratio
        const fitWidthMm = 210; // base mm
        const fitHeightMm = (canvasHeight / canvasWidth) * fitWidthMm;
        pdf.addPage([fitWidthMm, fitHeightMm], pageOrientation);
      } else {
        pdf.addPage(options.pageSize, pageOrientation);
      }
    } else if (options.pageSize === 'fit') {
      // Set first page dimensions
      // jsPDF constructor default page size adjustment
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = options.margin;

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const imgRatio = canvasWidth / canvasHeight;
    const pageRatio = availableWidth / availableHeight;

    let renderWidth = availableWidth;
    let renderHeight = availableHeight;

    if (imgRatio > pageRatio) {
      renderHeight = availableWidth / imgRatio;
    } else {
      renderWidth = availableHeight * imgRatio;
    }

    const x = margin + (availableWidth - renderWidth) / 2;
    const y = margin + (availableHeight - renderHeight) / 2;

    pdf.addImage(imgDataUrl, 'JPEG', x, y, renderWidth, renderHeight, undefined, 'FAST');
  }

  const pdfOutput = pdf.output('blob');
  return pdfOutput;
}

/**
 * Helper to decompress deflate streams using standard browser DecompressionStream
 */
async function decompressDeflate(bytes: Uint8Array): Promise<Uint8Array | null> {
  if (typeof DecompressionStream === 'undefined') return null;
  try {
    const ds = new DecompressionStream('deflate');
    const writer = ds.writable.getWriter();
    writer.write(bytes);
    writer.close();
    const reader = ds.readable.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const c of chunks) {
      result.set(c, offset);
      offset += c.length;
    }
    return result;
  } catch {
    return null;
  }
}

/**
 * Compresses a PDF file directly in the browser using pdf-lib and canvas.
 * - Detects and recompresses embedded photographic/scanned raster images
 * - Removes unnecessary metadata and cleans redundant structures
 * - Packs objects into compressed streams
 * - Enforces the strict rule: If output >= original, the original file is preserved.
 * - Displayed size is ALWAYS actualBlob.size.
 */
export async function compressPdfFile(
  file: File,
  level: 'extreme' | 'balanced' | 'light' = 'balanced'
): Promise<PdfCompressionResult> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();

  // Load PDF with pdf-lib
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: false,
    updateMetadata: false,
  });

  const pageCount = pdfDoc.getPageCount();

  // Optimization: Clean / reset unnecessary metadata strings to free bytes
  if (level === 'extreme' || level === 'balanced') {
    try {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('FileFixer.online PDF Engine');
      pdfDoc.setCreator('FileFixer.online');
    } catch (metaErr) {
      console.warn('Metadata reset notice:', metaErr);
    }
  }

  // Level-based settings for embedded image optimization
  const targetSettings = {
    extreme: { maxDim: 1200, quality: 0.50, minSizeToProcess: 10 * 1024 },
    balanced: { maxDim: 1600, quality: 0.68, minSizeToProcess: 15 * 1024 },
    light: { maxDim: 2200, quality: 0.82, minSizeToProcess: 25 * 1024 },
  }[level];

  let imagesOptimized = 0;

  // Scan and recompress embedded raster images (DCTDecode / FlateDecode)
  try {
    for (const [ref, obj] of pdfDoc.context.enumerateIndirectObjects()) {
      if (obj instanceof PDFRawStream) {
        const dict = obj.dict;
        const subtype = dict.get(PDFName.of('Subtype'))?.toString();
        if (subtype !== '/Image') continue;

        // Skip 1-bit image masks
        const isImageMask = dict.get(PDFName.of('ImageMask'))?.toString() === 'true';
        if (isImageMask) continue;

        const filterObj = dict.get(PDFName.of('Filter'));
        const filterName = filterObj ? filterObj.toString() : '';
        const hasSMask = dict.has(PDFName.of('SMask'));

        const isDCT = filterName === '/DCTDecode' || filterName.includes('DCTDecode');
        const isFlate = filterName === '/FlateDecode' || filterName.includes('FlateDecode');

        if (isDCT && obj.contents.length > targetSettings.minSizeToProcess) {
          try {
            const imageBlob = new Blob([obj.contents], { type: 'image/jpeg' });
            const img = await loadImage(imageBlob);

            const origW = img.naturalWidth || img.width;
            const origH = img.naturalHeight || img.height;

            let w = origW;
            let h = origH;

            // If it has an SMask (transparency), preserve exact dimensions to prevent coordinate/mask mismatch
            if (!hasSMask && (w > targetSettings.maxDim || h > targetSettings.maxDim)) {
              if (w >= h) {
                h = Math.round((h * targetSettings.maxDim) / w);
                w = targetSettings.maxDim;
              } else {
                w = Math.round((w * targetSettings.maxDim) / h);
                h = targetSettings.maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, w);
            canvas.height = Math.max(1, h);
            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const newBlob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob((b) => resolve(b), 'image/jpeg', targetSettings.quality);
            });

            if (newBlob) {
              const newBytes = new Uint8Array(await newBlob.arrayBuffer());
              // Only replace if the recompressed image is genuinely smaller
              if (newBytes.length < obj.contents.length * 0.95) {
                dict.set(PDFName.of('Width'), PDFNumber.of(canvas.width));
                dict.set(PDFName.of('Height'), PDFNumber.of(canvas.height));
                dict.set(PDFName.of('Length'), PDFNumber.of(newBytes.length));
                dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
                dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
                dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));

                const newStream = PDFRawStream.of(dict, newBytes);
                pdfDoc.context.assign(ref, newStream);
                imagesOptimized++;
              }
            }
          } catch (imgErr) {
            console.warn('Could not recompress embedded DCT image:', imgErr);
          }
        } else if (isFlate && !hasSMask && obj.contents.length > targetSettings.minSizeToProcess * 2) {
          try {
            const widthNum = dict.get(PDFName.of('Width'));
            const heightNum = dict.get(PDFName.of('Height'));
            const bpcNum = dict.get(PDFName.of('BitsPerComponent'));
            const cs = dict.get(PDFName.of('ColorSpace'))?.toString();

            if (widthNum && heightNum && bpcNum?.toString() === '8' && (cs === '/DeviceRGB' || cs === '/DeviceGray')) {
              const w = typeof (widthNum as any).asNumber === 'function' ? (widthNum as any).asNumber() : parseInt(widthNum.toString(), 10);
              const h = typeof (heightNum as any).asNumber === 'function' ? (heightNum as any).asNumber() : parseInt(heightNum.toString(), 10);

              if (w > 0 && h > 0 && typeof DecompressionStream !== 'undefined') {
                const decompressed = await decompressDeflate(obj.contents);
                if (decompressed) {
                  let rgba: Uint8ClampedArray | null = null;
                  if (cs === '/DeviceRGB' && decompressed.length === w * h * 3) {
                    rgba = new Uint8ClampedArray(w * h * 4);
                    for (let i = 0, j = 0; i < decompressed.length; i += 3, j += 4) {
                      rgba[j] = decompressed[i];
                      rgba[j + 1] = decompressed[i + 1];
                      rgba[j + 2] = decompressed[i + 2];
                      rgba[j + 3] = 255;
                    }
                  } else if (cs === '/DeviceGray' && decompressed.length === w * h) {
                    rgba = new Uint8ClampedArray(w * h * 4);
                    for (let i = 0, j = 0; i < decompressed.length; i++, j += 4) {
                      const g = decompressed[i];
                      rgba[j] = g;
                      rgba[j + 1] = g;
                      rgba[j + 2] = g;
                      rgba[j + 3] = 255;
                    }
                  }

                  if (rgba) {
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      const imgData = new ImageData(rgba, w, h);
                      ctx.putImageData(imgData, 0, 0);

                      let targetW = w;
                      let targetH = h;
                      if (w > targetSettings.maxDim || h > targetSettings.maxDim) {
                        if (w >= h) {
                          targetH = Math.round((h * targetSettings.maxDim) / w);
                          targetW = targetSettings.maxDim;
                        } else {
                          targetW = Math.round((w * targetSettings.maxDim) / h);
                          targetH = targetSettings.maxDim;
                        }
                      }

                      let finalCanvas = canvas;
                      if (targetW !== w || targetH !== h) {
                        const scaledCanvas = document.createElement('canvas');
                        scaledCanvas.width = targetW;
                        scaledCanvas.height = targetH;
                        const sCtx = scaledCanvas.getContext('2d');
                        if (sCtx) {
                          sCtx.drawImage(canvas, 0, 0, targetW, targetH);
                          finalCanvas = scaledCanvas;
                        }
                      }

                      const newBlob = await new Promise<Blob | null>((resolve) => {
                        finalCanvas.toBlob((b) => resolve(b), 'image/jpeg', targetSettings.quality);
                      });

                      if (newBlob) {
                        const newBytes = new Uint8Array(await newBlob.arrayBuffer());
                        if (newBytes.length < obj.contents.length * 0.9) {
                          dict.set(PDFName.of('Width'), PDFNumber.of(finalCanvas.width));
                          dict.set(PDFName.of('Height'), PDFNumber.of(finalCanvas.height));
                          dict.set(PDFName.of('Length'), PDFNumber.of(newBytes.length));
                          dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
                          dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
                          dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));

                          const newStream = PDFRawStream.of(dict, newBytes);
                          pdfDoc.context.assign(ref, newStream);
                          imagesOptimized++;
                        }
                      }
                    }
                  }
                }
              }
            }
          } catch (flateErr) {
            console.warn('Could not optimize FlateDecode image:', flateErr);
          }
        }
      }
    }
  } catch (scanErr) {
    console.warn('Error during image stream optimization:', scanErr);
  }

  // Save with pdf-lib optimization flags (useObjectStreams compresses objects into streams)
  const optimizedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
  });

  const outputBlob = new Blob([optimizedBytes], { type: 'application/pdf' });

  // STRICT RULE:
  // Compare output Blob.size with original File.size
  // If output < original: return compressed file
  // If output >= original: return original file
  const isSmaller = outputBlob.size < originalSize;
  const finalBlob = isSmaller ? outputBlob : file;
  const compressedSize = finalBlob.size; // ALWAYS actualBlob.size
  const isAlreadyOptimal = !isSmaller;
  const savedBytes = isSmaller ? originalSize - compressedSize : 0;
  const savedPercent = isSmaller && originalSize > 0 ? Math.max(0, Math.round((savedBytes / originalSize) * 100)) : 0;

  const originalName = file.name;
  const extIndex = originalName.lastIndexOf('.');
  const baseName = extIndex !== -1 ? originalName.substring(0, extIndex) : originalName;
  const outputFilename = isSmaller ? `${baseName}-compressed.pdf` : file.name;
  const compressedUrl = URL.createObjectURL(finalBlob);

  return {
    originalSize,
    compressedSize,
    savedBytes,
    savedPercent,
    pageCount,
    originalName: outputFilename,
    compressedBlob: finalBlob,
    compressedUrl,
    compressionLevel: level,
    isAlreadyOptimal,
    imagesOptimized,
    statusMessage: isAlreadyOptimal
      ? 'This PDF is already optimally compressed. The original file has been preserved to prevent size inflation.'
      : undefined,
  };
}

/**
 * Reads page count of a PDF file directly in the browser
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (err) {
    console.warn('Could not extract page count:', err);
    return 1;
  }
}

/**
 * Merges multiple PDF files into one single PDF document using pdf-lib
 */
export async function mergePdfFiles(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<{ blob: Blob; pageCount: number; size: number }> {
  if (files.length === 0) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedPdf = await PDFDocument.create();
  mergedPdf.setTitle('Merged Document');
  mergedPdf.setProducer('FileFixer.online PDF Engine');
  mergedPdf.setCreator('FileFixer.online');

  let totalPages = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
    totalPages += copiedPages.length;

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
  const blob = new Blob([mergedBytes], { type: 'application/pdf' });

  return {
    blob,
    pageCount: totalPages,
    size: blob.size,
  };
}

