import React, { useState, useEffect, useCallback } from 'react';
import { 
  Minimize2, 
  Download, 
  RotateCcw, 
  Sliders, 
  ArrowRight, 
  Sparkles, 
  FileCheck, 
  Layers, 
  Maximize2, 
  FileText, 
  FileArchive,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { AdPlacement } from './AdPlacement';
import { ToolId, CompressedImageResult } from '../types';
import { compressImageFile, downloadBlob, formatBytes, fireCelebration } from '../utils/fileUtils';

interface CompressImageToolProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const CompressImageTool: React.FC<CompressImageToolProps> = ({ onSelectTool, onOpenPro }) => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [targetFormat, setTargetFormat] = useState<string>('original');
  const [maxWidth, setMaxWidth] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'side-by-side' | 'compressed-only' | 'original-only'>('side-by-side');

  const processCompression = useCallback(async (currentFile: File, q: number, format: string, maxW: number | '') => {
    setIsProcessing(true);
    setError(null);
    try {
      let mime: string | undefined = undefined;
      if (format === 'webp') mime = 'image/webp';
      else if (format === 'jpeg' || format === 'jpg') mime = 'image/jpeg';
      else if (format === 'png') mime = 'image/png';
      else mime = currentFile.type === 'image/png' ? 'image/png' : 'image/jpeg';

      const res = await compressImageFile(
        currentFile,
        q,
        mime,
        typeof maxW === 'number' && maxW > 0 ? maxW : undefined
      );
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to compress image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    processCompression(selected, quality, targetFormat, maxWidth);
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (file) {
      processCompression(file, newQuality, targetFormat, maxWidth);
    }
  };

  const handleFormatChange = (newFormat: string) => {
    setTargetFormat(newFormat);
    if (file) {
      processCompression(file, quality, newFormat, maxWidth);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, result.name);
    fireCelebration();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Tool Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Client-Side Image Compressor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Compress Image Online
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Reduce JPG, PNG, and WebP file size up to 90% without visible loss in quality. 100% private in your browser.
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
              title="Drag & drop your image here"
              subtitle="Supports JPG, JPEG, PNG, and WebP up to 50MB."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action Bar / Controls */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-6">
              {/* Quality Slider & Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="compression-quality-slider" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <span>Compression Quality: <span className="text-indigo-600">{quality}%</span></span>
                  </label>
                  <span className="text-xs text-slate-500 font-medium">
                    {quality <= 50 ? 'Smaller Size' : quality <= 80 ? 'Balanced' : 'High Quality'}
                  </span>
                </div>

                <input
                  id="compression-quality-slider"
                  type="range"
                  min="5"
                  max="98"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { label: 'Max Compression (40%)', val: 40 },
                    { label: 'Recommended (75%)', val: 75 },
                    { label: 'Crisp Detail (90%)', val: 90 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => handleQualityChange(preset.val)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        quality === preset.val
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'original', label: 'Auto / JPG' },
                      { id: 'webp', label: 'WebP (Smallest)' },
                      { id: 'png', label: 'PNG' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => handleFormatChange(fmt.id)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                          targetFormat === fmt.id
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Max Width (Optional Downscale)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 1920"
                      value={maxWidth}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.max(100, Number(e.target.value));
                        setMaxWidth(val);
                        if (file) processCompression(file, quality, targetFormat, val);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {maxWidth !== '' && (
                      <button
                        onClick={() => {
                          setMaxWidth('');
                          if (file) processCompression(file, quality, targetFormat, '');
                        }}
                        className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 underline shrink-0"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl">
                {error}
              </div>
            )}

            {/* Comparison Metrics Bar */}
            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
                  <div className="text-center sm:text-left sm:pl-2">
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Original
                    </span>
                    <div className="text-sm sm:text-lg font-extrabold text-slate-200">
                      {formatBytes(result.originalSize)}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] sm:text-xs text-indigo-300 uppercase font-bold tracking-wider">
                      Compressed
                    </span>
                    <div className="text-sm sm:text-lg font-extrabold text-white">
                      {formatBytes(result.compressedSize)}
                    </div>
                  </div>

                  <div className="text-center sm:text-right sm:pr-2">
                    <span className="text-[10px] sm:text-xs text-emerald-400 uppercase font-bold tracking-wider">
                      Saved
                    </span>
                    <div className="text-sm sm:text-xl font-extrabold text-emerald-400">
                      {result.isAlreadyOptimal || result.savedPercent === 0 ? '0%' : `-${result.savedPercent}%`}
                    </div>
                  </div>
                </div>

                {/* Status Callout Banner */}
                {result.isAlreadyOptimal ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-950">Image is already at optimal compression</div>
                      <p className="mt-0.5 text-amber-800 leading-relaxed text-xs">
                        This image is already highly optimized. Re-encoding at this quality level would increase file size, so your original file was preserved. To reduce size further, try lowering the quality slider below, switching to WebP, or downscaling the maximum width.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-950">
                        Saved {formatBytes(result.savedBytes)} ({result.savedPercent}% reduction)
                      </div>
                      <p className="mt-0.5 text-emerald-800 leading-relaxed text-xs">
                        Optimized to {result.format} format with verified output size of {formatBytes(result.compressedSize)}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview Section */}
            {result && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Image Preview ({result.width} × {result.height}px)
                  </span>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => setPreviewMode('side-by-side')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        previewMode === 'side-by-side' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => setPreviewMode('compressed-only')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        previewMode === 'compressed-only' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Compressed
                    </button>
                  </div>
                </div>

                <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3 sm:p-4 overflow-hidden">
                  {previewMode === 'side-by-side' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                          <span>Original</span>
                          <span className="text-[11px] font-mono text-slate-500">{formatBytes(result.originalSize)}</span>
                        </div>
                        <div className="aspect-video bg-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center">
                          <img
                            src={result.originalUrl}
                            alt="Original preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-indigo-700 mb-1 flex items-center justify-between">
                          <span>Compressed ({quality}%)</span>
                          <span className="text-[11px] font-mono font-bold text-emerald-600">{formatBytes(result.compressedSize)}</span>
                        </div>
                        <div className="aspect-video bg-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center">
                          <img
                            src={result.compressedUrl}
                            alt="Compressed preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video max-h-80 bg-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={result.compressedUrl}
                        alt="Compressed full preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons: Download & Reset */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="compress-download-btn"
                onClick={handleDownload}
                disabled={isProcessing || !result}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-base shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isProcessing
                    ? 'Compressing...'
                    : result?.isAlreadyOptimal
                    ? `Download Preserved Image (${formatBytes(result.compressedSize)})`
                    : `Download Compressed Image (${result ? formatBytes(result.compressedSize) : ''})`}
                </span>
              </button>

              <button
                id="compress-reset-btn"
                onClick={handleReset}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Compress Another</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ad Placement */}
      <AdPlacement slot="leaderboard" onOpenPro={onOpenPro} />

      {/* Try Another Tool Grid */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Try Another Everyday Tool</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => {
              onSelectTool('resize-image');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Maximize2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-indigo-600">Resize Image</h4>
            <p className="text-xs text-slate-500">Change image dimensions with pixel precision and 1080p presets.</p>
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
            <p className="text-xs text-slate-500">Combine multiple photos and images into a single PDF document.</p>
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
            <p className="text-xs text-slate-500">Shrink oversized PDF documents for emails and uploads.</p>
          </button>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-14 pt-10 border-t border-slate-200 text-slate-600 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">
          How to Compress Images Online for Free
        </h2>
        <p>
          Whether you need to shrink photos for email attachments, speed up website loading times, or save disk space on your phone, FileFixer.online provides an intuitive, instant image compression utility right in your browser.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">1. Select or Drop File</h4>
            <p className="text-xs text-slate-500">Upload your JPG, JPEG, PNG, or WebP photo into the secure dropzone.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">2. Fine-tune Quality</h4>
            <p className="text-xs text-slate-500">Adjust the quality slider or click presets like Recommended (75%) for instant balancing.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">3. Download Result</h4>
            <p className="text-xs text-slate-500">Compare before/after file sizes and click Download to save your compressed image.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>No files are sent to remote servers. All image compression algorithms run securely in your device's browser memory.</span>
        </div>
      </div>
    </div>
  );
};
