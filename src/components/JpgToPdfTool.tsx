import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCw, 
  Sliders, 
  FileCheck2, 
  Maximize2, 
  Minimize2, 
  FileArchive,
  CheckCircle2
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { AdPlacement } from './AdPlacement';
import { ToolId, ImageItemForPdf } from '../types';
import { generatePdfFromImages, downloadBlob, formatBytes, fireCelebration } from '../utils/fileUtils';

interface JpgToPdfToolProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const JpgToPdfTool: React.FC<JpgToPdfToolProps> = ({ onSelectTool, onOpenPro }) => {
  const [images, setImages] = useState<ImageItemForPdf[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [margin, setMargin] = useState<number>(0);
  const [pdfName, setPdfName] = useState<string>('converted-document.pdf');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddFiles = (files: File[]) => {
    setError(null);
    const newItems: ImageItemForPdf[] = files.map((f, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
      width: 0,
      height: 0,
      rotation: 0,
    }));

    setImages((prev) => [...prev, ...newItems]);
    setGeneratedBlob(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages(updated);
    setGeneratedBlob(null);
  };

  const rotateImage = (index: number) => {
    const updated = [...images];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setImages(updated);
    setGeneratedBlob(null);
  };

  const removeImage = (index: number) => {
    const target = images[index];
    URL.revokeObjectURL(target.previewUrl);
    setImages(images.filter((_, i) => i !== index));
    setGeneratedBlob(null);
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setError(null);

    try {
      const blob = await generatePdfFromImages(images, {
        pageSize,
        orientation,
        margin,
      });
      setGeneratedBlob(blob);
      downloadBlob(blob, pdfName.endsWith('.pdf') ? pdfName : `${pdfName}.pdf`);
      fireCelebration();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setGeneratedBlob(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Client-Side JPG to PDF Converter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Convert JPG to PDF Online
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Combine single or multiple JPG, PNG, and WebP images into one organized, high-quality PDF document.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
        {images.length === 0 ? (
          <div>
            <Dropzone
              onFilesSelected={handleAddFiles}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              acceptLabel="JPG, PNG, WebP"
              multiple={true}
              maxSizeMB={50}
              iconType="image"
              title="Upload JPG or PNG images"
              subtitle="Drop one or multiple photos to convert into a single PDF document."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Toolbar / Options */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Layout & PDF Settings
                </span>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs">
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add More Images</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      if (e.target.files) handleAddFiles(Array.from(e.target.files));
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Page Size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Page Format
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(e.target.value as any);
                      setGeneratedBlob(null);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="a4">A4 (Standard Document)</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">Fit to Image Size</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => {
                      setOrientation(e.target.value as any);
                      setGeneratedBlob(null);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="auto">Auto Detect (Recommended)</option>
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="landscape">Landscape (Horizontal)</option>
                  </select>
                </div>

                {/* Margins */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Margin Border
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => {
                      setMargin(Number(e.target.value));
                      setGeneratedBlob(null);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value={0}>No Margin (Edge-to-Edge)</option>
                    <option value={10}>Small Margin (10mm)</option>
                    <option value={20}>Standard Margin (20mm)</option>
                  </select>
                </div>
              </div>

              {/* Custom Filename */}
              <div className="pt-2">
                <label htmlFor="jpg-to-pdf-filename" className="block text-xs font-semibold text-slate-600 mb-1">
                  PDF Filename
                </label>
                <input
                  id="jpg-to-pdf-filename"
                  type="text"
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                  className="w-full sm:w-80 px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="converted-document.pdf"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl">
                {error}
              </div>
            )}

            {/* Image List / Re-ordering */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Sequence ({images.length} {images.length === 1 ? 'page' : 'pages'})
                </span>
                <span className="text-xs text-slate-500">
                  Use arrows to reorder pages
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative group bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    {/* Page badge */}
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                      Page {index + 1}
                    </div>

                    {/* Image Thumbnail */}
                    <div className="aspect-3/4 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center relative mb-2">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                        className="max-h-full max-w-full object-contain transition-transform duration-150"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="truncate text-[11px] font-medium text-slate-700 mb-2 px-1" title={item.name}>
                      {item.name}
                    </div>

                    {/* Action buttons (Move Up, Move Down, Rotate, Delete) */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 text-slate-600 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === images.length - 1}
                          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 text-slate-600 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => rotateImage(index)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Convert & Reset */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200">
              <button
                id="jpg-to-pdf-generate-btn"
                onClick={handleGeneratePdf}
                disabled={isGenerating || images.length === 0}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-bold text-base shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isGenerating
                    ? 'Generating PDF Document...'
                    : `Convert & Download PDF (${images.length} ${images.length === 1 ? 'Page' : 'Pages'})`}
                </span>
              </button>

              <button
                id="jpg-to-pdf-reset-btn"
                onClick={handleReset}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
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
            <p className="text-xs text-slate-500">Change image dimensions with pixel precision and presets.</p>
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
          Combine Photos and Images into a Single PDF
        </h2>
        <p>
          Turn smartphone photo receipts, scanned book pages, passport scans, and diagrams into a clean, unified PDF file. Reorder pages with a single click, adjust margin widths, and download your finished document instantly.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Client-Side Compilation: The PDF file is rendered and compiled entirely in your browser using jsPDF. No uploads required.</span>
        </div>
      </div>
    </div>
  );
};
