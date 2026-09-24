import React, { useState, useEffect, useCallback } from 'react';
import { 
  Maximize2, 
  Download, 
  RotateCcw, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Sparkles, 
  Minimize2, 
  FileText, 
  FileArchive,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { AdPlacement } from './AdPlacement';
import { ToolId } from '../types';
import { resizeImageFile, loadImage, downloadBlob, formatBytes, fireCelebration } from '../utils/fileUtils';

interface ResizeImageToolProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const ResizeImageTool: React.FC<ResizeImageToolProps> = ({ onSelectTool, onOpenPro }) => {
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Load natural dimensions when file is selected
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);

    try {
      const img = await loadImage(selected);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setOriginalWidth(w);
      setOriginalHeight(h);
      setWidth(w);
      setHeight(h);

      // Default format matching input
      if (selected.type === 'image/png') setFormat('image/png');
      else if (selected.type === 'image/webp') setFormat('image/webp');
      else setFormat('image/jpeg');

      // Process initial resize
      processResize(selected, w, h, selected.type === 'image/png' ? 'image/png' : 'image/jpeg', 90);
    } catch (err: any) {
      setError('Unable to read image dimensions. Please try another image.');
    }
  };

  const processResize = useCallback(
    async (
      currentFile: File,
      w: number,
      h: number,
      fmt: 'image/jpeg' | 'image/png' | 'image/webp',
      q: number
    ) => {
      if (w <= 0 || h <= 0) return;
      setIsProcessing(true);
      setError(null);
      try {
        const res = await resizeImageFile(currentFile, w, h, fmt, q);
        setResizedBlob(res.blob);
        setPreviewUrl(res.url);
        setResizedSize(res.size);
        setDownloadFilename(res.filename);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to resize image.');
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspectRatio && originalWidth > 0) {
      const newHeight = Math.max(1, Math.round((val * originalHeight) / originalWidth));
      setHeight(newHeight);
      if (file) processResize(file, val, newHeight, format, quality);
    } else {
      if (file) processResize(file, val, height, format, quality);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspectRatio && originalHeight > 0) {
      const newWidth = Math.max(1, Math.round((val * originalWidth) / originalHeight));
      setWidth(newWidth);
      if (file) processResize(file, newWidth, val, format, quality);
    } else {
      if (file) processResize(file, width, val, format, quality);
    }
  };

  // Presets
  const applyPreset = (type: '1080p' | '720p' | '4k' | '50%' | '25%' | 'square' | 'story') => {
    if (!file || originalWidth === 0 || originalHeight === 0) return;

    let targetW = originalWidth;
    let targetH = originalHeight;

    if (type === '50%') {
      targetW = Math.round(originalWidth * 0.5);
      targetH = Math.round(originalHeight * 0.5);
    } else if (type === '25%') {
      targetW = Math.round(originalWidth * 0.25);
      targetH = Math.round(originalHeight * 0.25);
    } else if (type === '1080p') {
      if (originalWidth >= originalHeight) {
        targetW = 1920;
        targetH = lockAspectRatio ? Math.round((1920 * originalHeight) / originalWidth) : 1080;
      } else {
        targetH = 1080;
        targetW = lockAspectRatio ? Math.round((1080 * originalWidth) / originalHeight) : 1920;
      }
    } else if (type === '720p') {
      if (originalWidth >= originalHeight) {
        targetW = 1280;
        targetH = lockAspectRatio ? Math.round((1280 * originalHeight) / originalWidth) : 720;
      } else {
        targetH = 720;
        targetW = lockAspectRatio ? Math.round((720 * originalWidth) / originalHeight) : 1280;
      }
    } else if (type === '4k') {
      targetW = 3840;
      targetH = lockAspectRatio ? Math.round((3840 * originalHeight) / originalWidth) : 2160;
    } else if (type === 'square') {
      targetW = 1080;
      targetH = 1080;
    } else if (type === 'story') {
      targetW = 1080;
      targetH = 1920;
    }

    setWidth(targetW);
    setHeight(targetH);
    processResize(file, targetW, targetH, format, quality);
  };

  const handleDownload = () => {
    if (!resizedBlob || !downloadFilename) return;
    downloadBlob(resizedBlob, downloadFilename);
    fireCelebration();
  };

  const handleReset = () => {
    setFile(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(0);
    setHeight(0);
    setPreviewUrl(null);
    setResizedBlob(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Tool Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-3">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Client-Side Image Resizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Resize Image Online
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Scale photos by pixels or percentages with aspect ratio lock, 1080p presets, and format conversion.
        </p>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
        {!file ? (
          <div>
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              acceptLabel="JPG, PNG, WebP"
              maxSizeMB={50}
              iconType="image"
              title="Upload image to resize"
              subtitle="Supports JPG, JPEG, PNG, and WebP."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Control Box */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-6">
              {/* Presets Row */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Popular Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyPreset('1080p')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-2xs transition-colors"
                  >
                    1080p Full HD
                  </button>
                  <button
                    onClick={() => applyPreset('720p')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-2xs transition-colors"
                  >
                    720p HD
                  </button>
                  <button
                    onClick={() => applyPreset('50%')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-2xs transition-colors"
                  >
                    50% Scale
                  </button>
                  <button
                    onClick={() => applyPreset('25%')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-2xs transition-colors"
                  >
                    25% Scale
                  </button>
                  <button
                    onClick={() => applyPreset('square')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-2xs transition-colors"
                  >
                    Square (1:1)
                  </button>
                  <button
                    onClick={() => applyPreset('story')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-2xs transition-colors"
                  >
                    Story (9:16)
                  </button>
                </div>
              </div>

              {/* Dimensions Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                {/* Width */}
                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="resize-width-input" className="block text-xs font-bold text-slate-700">
                    Width (px)
                  </label>
                  <div className="relative">
                    <input
                      id="resize-width-input"
                      type="number"
                      min="1"
                      max="10000"
                      value={width || ''}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">px</span>
                  </div>
                </div>

                {/* Aspect Ratio Lock Button */}
                <div className="flex justify-center pt-2 sm:pt-4">
                  <button
                    id="resize-aspect-ratio-btn"
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                      lockAspectRatio
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                    title={lockAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                  >
                    {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    <span className="sm:hidden">{lockAspectRatio ? 'Ratio Locked' : 'Ratio Free'}</span>
                  </button>
                </div>

                {/* Height */}
                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="resize-height-input" className="block text-xs font-bold text-slate-700">
                    Height (px)
                  </label>
                  <div className="relative">
                    <input
                      id="resize-height-input"
                      type="number"
                      min="1"
                      max="10000"
                      value={height || ''}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">px</span>
                  </div>
                </div>
              </div>

              {/* Format & Quality Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'image/jpeg', label: 'JPG / JPEG' },
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/webp', label: 'WebP' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => {
                          const newFmt = fmt.id as any;
                          setFormat(newFmt);
                          if (file) processResize(file, width, height, newFmt, quality);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          format === fmt.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="resize-quality-slider" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Quality ({quality}%)
                  </label>
                  <input
                    id="resize-quality-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      setQuality(q);
                      if (file) processResize(file, width, height, format, q);
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>Smaller file</span>
                    <span>Crisp clarity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl">
                {error}
              </div>
            )}

            {/* Stats Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Original Dimensions</span>
                <span className="text-sm sm:text-base font-bold font-mono text-slate-200">
                  {originalWidth} × {originalHeight}px ({formatBytes(file.size)})
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-indigo-300 block">Resized Output</span>
                <span className="text-sm sm:text-base font-bold font-mono text-white">
                  {width} × {height}px (~{formatBytes(resizedSize)})
                </span>
              </div>
            </div>

            {/* Live Preview */}
            {previewUrl && (
              <div className="border border-slate-200 bg-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px]">
                <div className="text-xs font-bold text-slate-500 mb-2">Live Scaled Preview</div>
                <div className="max-h-72 max-w-full overflow-hidden rounded-xl bg-slate-200 flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={previewUrl}
                    alt="Resized preview"
                    className="max-h-64 max-w-full object-contain rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="resize-download-btn"
                onClick={handleDownload}
                disabled={isProcessing || !resizedBlob}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-base shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isProcessing ? 'Resizing Image...' : `Download Resized Image (${width}×${height}px)`}
                </span>
              </button>

              <button
                id="resize-reset-btn"
                onClick={handleReset}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resize Another</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ad Placement */}
      <AdPlacement slot="leaderboard" onOpenPro={onOpenPro} />

      {/* Try Another Tool */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Try Another Everyday Tool</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => {
              onSelectTool('compress-image');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Minimize2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-blue-600">Compress Image</h4>
            <p className="text-xs text-slate-500">Reduce JPG, PNG, and WebP file size up to 90% in seconds.</p>
          </button>

          <button
            onClick={() => {
              onSelectTool('jpg-to-pdf');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-amber-600">JPG to PDF</h4>
            <p className="text-xs text-slate-500">Combine multiple photos into a clean single PDF file.</p>
          </button>

          <button
            onClick={() => {
              onSelectTool('compress-pdf');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileArchive className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-emerald-600">Compress PDF</h4>
            <p className="text-xs text-slate-500">Optimize and shrink large PDF documents locally.</p>
          </button>
        </div>
      </div>

      {/* SEO Section */}
      <div className="mt-14 pt-10 border-t border-slate-200 text-slate-600 space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">
          Resize Images Online with Aspect Ratio Locking
        </h2>
        <p>
          Need to fit an exact pixel requirement for a profile banner, blog thumbnail, or passport photo? FileFixer.online lets you accurately change image dimensions while preventing distortion using our intelligent aspect-ratio lock.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Zero Server Uploads: High-quality bicubic canvas interpolation runs natively inside your web browser.</span>
        </div>
      </div>
    </div>
  );
};
