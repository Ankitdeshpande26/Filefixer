import React, { useState, useRef } from 'react';
import { 
  Images, 
  Download, 
  RotateCcw, 
  Plus, 
  Trash2, 
  RotateCw, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Loader2,
  GripVertical
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { AdPlacement } from './AdPlacement';
import { ImageItemForPdf, ToolId } from '../types';
import { generatePdfFromImages, downloadBlob, formatBytes, fireCelebration } from '../utils/fileUtils';

interface ImageToPdfToolProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const ImageToPdfTool: React.FC<ImageToPdfToolProps> = ({ onSelectTool, onOpenPro }) => {
  const [images, setImages] = useState<ImageItemForPdf[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [margin, setMargin] = useState<number>(10); // mm
  const [pdfName, setPdfName] = useState<string>('converted-document');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: File[]) => {
    const validImageFiles = files.filter((f) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type) ||
      /\.(jpe?g|png|webp)$/i.test(f.name)
    );

    if (validImageFiles.length === 0) return;

    const newItems: ImageItemForPdf[] = validImageFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        width: 0,
        height: 0,
        rotation: 0,
      };
    });

    setImages((prev) => [...prev, ...newItems]);
    setGeneratedPdfBlob(null);
    setGeneratedPdfUrl(null);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
    setGeneratedPdfBlob(null);
    setGeneratedPdfUrl(null);
  };

  const handleRotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          return { ...img, rotation: (img.rotation + 90) % 360 };
        }
        return img;
      })
    );
    setGeneratedPdfBlob(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
    setGeneratedPdfBlob(null);
  };

  // Drag and Drop reordering handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const reordered = [...images];
    const draggedItem = reordered[draggedIndex];
    reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setImages(reordered);
    setGeneratedPdfBlob(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setProgressText(`Processing ${images.length} image${images.length > 1 ? 's' : ''}...`);

    try {
      const blob = await generatePdfFromImages(images, {
        pageSize,
        orientation,
        margin,
      });

      setGeneratedPdfBlob(blob);
      const url = URL.createObjectURL(blob);
      setGeneratedPdfUrl(url);
      setProgressText('');
    } catch (err: any) {
      console.error(err);
      alert('Error generating PDF document: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedPdfBlob) return;
    const filename = (pdfName.trim() || 'converted-document').replace(/\.pdf$/i, '') + '.pdf';
    downloadBlob(generatedPdfBlob, filename);
    fireCelebration();
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl);
    setImages([]);
    setGeneratedPdfBlob(null);
    setGeneratedPdfUrl(null);
  };

  const totalImageSize = images.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Hidden file input for adding more images */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesSelected(Array.from(e.target.files));
          }
        }}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-3">
          <Images className="w-3.5 h-3.5" />
          <span>All Image Formats to PDF Converter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Convert Images to PDF Online
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Convert JPG, PNG, and WebP photos into a single PDF document. Rearrange pages, adjust orientation and margins directly in your browser.
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
        {images.length === 0 ? (
          <div>
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              acceptLabel="JPG, PNG, WebP Images"
              multiple={true}
              maxSizeMB={50}
              iconType="image"
              title="Upload images to convert to PDF"
              subtitle="Select multiple JPG, PNG, or WebP pictures to combine into one PDF document."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Toolbar: File counts, Add More, Clear */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {images.length} {images.length === 1 ? 'Page Selected' : 'Pages Selected'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Total images size: {formatBytes(totalImageSize)} • Drag cards to reorder
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More Photos</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Document PDF Settings Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              {/* Page Orientation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Page Orientation
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setOrientation('portrait');
                      setGeneratedPdfBlob(null);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      orientation === 'portrait'
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Portrait (Vertical)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrientation('landscape');
                      setGeneratedPdfBlob(null);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      orientation === 'landscape'
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Page Dimensions
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setPageSize('a4');
                      setGeneratedPdfBlob(null);
                    }}
                    className={`py-2 px-2 text-center rounded-lg text-xs font-bold transition-all ${
                      pageSize === 'a4'
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    A4
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPageSize('letter');
                      setGeneratedPdfBlob(null);
                    }}
                    className={`py-2 px-2 text-center rounded-lg text-xs font-bold transition-all ${
                      pageSize === 'letter'
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Letter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPageSize('fit');
                      setGeneratedPdfBlob(null);
                    }}
                    className={`py-2 px-2 text-center rounded-lg text-xs font-bold transition-all ${
                      pageSize === 'fit'
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Original (Fit)
                  </button>
                </div>
              </div>

              {/* Margin & Filename */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Output Filename
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={pdfName}
                    onChange={(e) => setPdfName(e.target.value)}
                    placeholder="converted-document"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                    .pdf
                  </span>
                </div>
              </div>
            </div>

            {/* Images Grid with Drag & Reorder */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Order ({images.length} {images.length === 1 ? 'Page' : 'Pages'})
                </span>
                <span className="text-xs text-slate-400">
                  Drag items or use arrows to change sequence
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`group relative bg-white border rounded-2xl p-2 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all cursor-move ${
                      draggedIndex === index ? 'opacity-40 border-purple-500 scale-95' : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {/* Page Number Badge & Drag handle */}
                    <div className="flex items-center justify-between mb-1.5 px-1">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                    </div>

                    {/* Image Thumbnail Preview */}
                    <div className="relative aspect-3/4 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100">
                      <img
                        src={img.previewUrl}
                        alt={img.name}
                        className="w-full h-full object-contain transition-transform duration-200"
                        style={{ transform: `rotate(${img.rotation}deg)` }}
                      />
                    </div>

                    {/* Filename and details */}
                    <div className="mt-2 px-1">
                      <div className="text-[11px] font-semibold text-slate-800 truncate" title={img.name}>
                        {img.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatBytes(img.size)}
                      </div>
                    </div>

                    {/* Action buttons (Rotate, Up, Down, Delete) */}
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleRotateImage(img.id)}
                        title="Rotate 90 degrees"
                        className="p-1 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          title="Move earlier"
                          className="p-1 hover:text-purple-600 hover:bg-purple-50 rounded-lg disabled:opacity-20 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === images.length - 1}
                          title="Move later"
                          className="p-1 hover:text-purple-600 hover:bg-purple-50 rounded-lg disabled:opacity-20 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        title="Remove page"
                        className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Status Bar if generating */}
            {isGenerating && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-3 text-purple-900 text-sm font-medium animate-pulse">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span>{progressText || 'Compiling PDF document in your browser...'}</span>
              </div>
            )}

            {/* Generated Ready View */}
            {generatedPdfBlob && !isGenerating && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-emerald-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">
                      PDF Document Ready! ({formatBytes(generatedPdfBlob.size)})
                    </div>
                    <div className="text-xs text-emerald-700">
                      Generated {images.length} {images.length === 1 ? 'page' : 'pages'} with {pageSize.toUpperCase()} ({orientation}) layout
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Generated PDF</span>
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="generate-image-to-pdf-btn"
                onClick={generatedPdfBlob ? handleDownload : handleGeneratePdf}
                disabled={isGenerating || images.length === 0}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white font-bold text-base shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating PDF Document...</span>
                  </>
                ) : generatedPdfBlob ? (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF ({images.length} {images.length === 1 ? 'Page' : 'Pages'})</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Convert {images.length} {images.length === 1 ? 'Image' : 'Images'} to PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-4 px-5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
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

      {/* Other Tools Recommendations */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Related Everyday Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => {
              onSelectTool('merge-pdf');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-cyan-600">Merge PDF</h4>
            <p className="text-xs text-slate-500">Combine multiple PDF files into one single document.</p>
          </button>

          <button
            onClick={() => {
              onSelectTool('compress-image');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Images className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-blue-600">Compress Image</h4>
            <p className="text-xs text-slate-500">Reduce JPG, PNG, and WebP file size up to 90% in seconds.</p>
          </button>

          <button
            onClick={() => {
              onSelectTool('compress-pdf');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-emerald-600">Compress PDF</h4>
            <p className="text-xs text-slate-500">Reduce PDF file size for fast email sharing and web portals.</p>
          </button>
        </div>
      </div>

      {/* SEO Section */}
      <div className="mt-14 pt-10 border-t border-slate-200 text-slate-600 space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">
          Fast and Private Image to PDF Conversion
        </h2>
        <p>
          Convert multiple photos into a consolidated PDF document directly in your browser. Whether you have screenshots, scanned receipts, camera photos, or design mocks, FileFixer.online processes all image formats (JPG, JPEG, PNG, and WebP) with zero server uploads for total privacy.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 p-3.5 rounded-xl border border-purple-200">
          <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600" />
          <span>Complete Data Privacy: Image rendering and PDF construction happen purely inside your browser memory.</span>
        </div>
      </div>
    </div>
  );
};
