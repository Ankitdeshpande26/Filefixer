import React, { useState } from 'react';
import { 
  FileArchive, 
  Download, 
  RotateCcw, 
  Sliders, 
  FileCheck2, 
  Minimize2, 
  Maximize2, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { AdPlacement } from './AdPlacement';
import { ToolId, PdfCompressionResult } from '../types';
import { compressPdfFile, downloadBlob, formatBytes, fireCelebration } from '../utils/fileUtils';

interface CompressPdfToolProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const CompressPdfTool: React.FC<CompressPdfToolProps> = ({ onSelectTool, onOpenPro }) => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'extreme' | 'balanced' | 'light'>('balanced');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [result, setResult] = useState<PdfCompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processCompression = async (currentFile: File, level: 'extreme' | 'balanced' | 'light') => {
    setIsCompressing(true);
    setError(null);

    try {
      const res = await compressPdfFile(currentFile, level);
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to compress PDF. The PDF may be password-protected or encrypted.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    processCompression(selected, compressionLevel);
  };

  const handleLevelChange = (level: 'extreme' | 'balanced' | 'light') => {
    setCompressionLevel(level);
    if (file) {
      processCompression(file, level);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.compressedBlob, result.originalName);
    fireCelebration();
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
          <FileArchive className="w-3.5 h-3.5" />
          <span>Client-Side PDF Compressor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Compress PDF Online
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Reduce PDF file size for fast email sharing and web portals without uploading to external servers.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
        {!file ? (
          <div>
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept="application/pdf,.pdf"
              acceptLabel="PDF Document"
              maxSizeMB={50}
              iconType="pdf"
              title="Upload your PDF document"
              subtitle="Drop a PDF file to reduce its size in your browser."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Compression Level Selector */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-4">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Compression Strength
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'extreme',
                    title: 'Extreme Compression',
                    desc: 'Max reduction • Optimizes images (1200px) & strips stream redundancies',
                    badge: 'Max Squeeze',
                  },
                  {
                    id: 'balanced',
                    title: 'Recommended',
                    desc: 'Balanced • Recompresses images (1600px) & packs object streams',
                    badge: 'Best Balance',
                  },
                  {
                    id: 'light',
                    title: 'Light Compression',
                    desc: 'High detail • Retains print resolution (2200px) & cleans metadata',
                    badge: 'High Detail',
                  },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleLevelChange(lvl.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      compressionLevel === lvl.id
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-xs font-bold ${compressionLevel === lvl.id ? 'text-emerald-900' : 'text-slate-900'}`}>
                        {lvl.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        compressionLevel === lvl.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {lvl.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl">
                {error}
              </div>
            )}

            {/* Results Overview */}
            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-teal-950 text-white">
                  <div className="text-center sm:text-left sm:pl-2">
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Original PDF
                    </span>
                    <div className="text-sm sm:text-lg font-extrabold text-slate-200">
                      {formatBytes(result.originalSize)}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] sm:text-xs text-teal-300 uppercase font-bold tracking-wider">
                      Compressed PDF
                    </span>
                    <div className="text-sm sm:text-lg font-extrabold text-white">
                      {formatBytes(result.compressedSize)}
                    </div>
                  </div>

                  <div className="text-center sm:text-right sm:pr-2">
                    <span className="text-[10px] sm:text-xs text-emerald-400 uppercase font-bold tracking-wider">
                      Reduction
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
                      <div className="font-bold text-amber-950">PDF is already optimally compressed</div>
                      <p className="mt-0.5 text-amber-800 leading-relaxed text-xs">
                        This document could not be compressed further without degrading quality or text readability. To ensure your file was not enlarged or inflated, your original file has been preserved.
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
                        {result.imagesOptimized && result.imagesOptimized > 0
                          ? `Recompressed ${result.imagesOptimized} embedded raster image${result.imagesOptimized > 1 ? 's' : ''} and optimized stream structures.`
                          : 'Optimized PDF object streams and removed redundant structural overhead.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* PDF File Details Card */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                        {result.originalName}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'} • Browser-verified Blob size: {formatBytes(result.compressedSize)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected & Cleaned</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="compress-pdf-download-btn"
                onClick={handleDownload}
                disabled={isCompressing || !result}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-base shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isCompressing
                    ? 'Compressing PDF Document...'
                    : result?.isAlreadyOptimal
                    ? `Download Preserved PDF (${formatBytes(result.compressedSize)})`
                    : `Download Compressed PDF (${result ? formatBytes(result.compressedSize) : ''})`}
                </span>
              </button>

              <button
                id="compress-pdf-reset-btn"
                onClick={handleReset}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Compress Another PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ad Placement */}
      <AdPlacement slot="leaderboard" onOpenPro={onOpenPro} />

      {/* Try Another Tool Grid */}
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
            <p className="text-xs text-slate-500">Combine multiple photos into a clean single PDF document.</p>
          </button>
        </div>
      </div>

      {/* SEO Section */}
      <div className="mt-14 pt-10 border-t border-slate-200 text-slate-600 space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">
          Compress PDF Files Privately in Your Browser
        </h2>
        <p>
          Need to shrink a PDF document to attach it to an email or government application portal? FileFixer.online processes and compresses PDF object trees, font tables, and content streams locally on your device without storing your personal data on any server.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Zero Server Uploads: All PDF manipulation occurs securely on your machine using pdf-lib.</span>
        </div>
      </div>
    </div>
  );
};
