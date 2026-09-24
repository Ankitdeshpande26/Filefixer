import React, { useState, useRef } from 'react';
import { 
  Layers, 
  Download, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Loader2, 
  GripVertical,
  FileCheck2
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { AdPlacement } from './AdPlacement';
import { PdfMergeItem, ToolId } from '../types';
import { getPdfPageCount, mergePdfFiles, downloadBlob, formatBytes, fireCelebration } from '../utils/fileUtils';

interface MergePdfToolProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const MergePdfTool: React.FC<MergePdfToolProps> = ({ onSelectTool, onOpenPro }) => {
  const [pdfFiles, setPdfFiles] = useState<PdfMergeItem[]>([]);
  const [pdfName, setPdfName] = useState<string>('merged-document');
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [mergedResult, setMergedResult] = useState<{ blob: Blob; pageCount: number; size: number } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (files: File[]) => {
    const validPdfFiles = files.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (validPdfFiles.length === 0) return;

    setError(null);
    const newItems: PdfMergeItem[] = [];

    for (const file of validPdfFiles) {
      const pageCount = await getPdfPageCount(file);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        pageCount,
      });
    }

    setPdfFiles((prev) => [...prev, ...newItems]);
    setMergedResult(null);
  };

  const handleRemoveFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((item) => item.id !== id));
    setMergedResult(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pdfFiles.length) return;

    const updated = [...pdfFiles];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPdfFiles(updated);
    setMergedResult(null);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...pdfFiles];
    const draggedItem = reordered[draggedIndex];
    reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setPdfFiles(reordered);
    setMergedResult(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setError('Please select at least 2 PDF files to merge into one.');
      return;
    }

    setIsMerging(true);
    setError(null);
    setProgressStatus(`Combining ${pdfFiles.length} PDF files...`);

    try {
      const rawFiles = pdfFiles.map((p) => p.file);
      const result = await mergePdfFiles(rawFiles, (current, total) => {
        setProgressStatus(`Merging document ${current} of ${total}...`);
      });

      setMergedResult(result);
      setProgressStatus('');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to merge PDF files. One of the documents may be password protected.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedResult) return;
    const filename = (pdfName.trim() || 'merged-document').replace(/\.pdf$/i, '') + '.pdf';
    downloadBlob(mergedResult.blob, filename);
    fireCelebration();
  };

  const handleReset = () => {
    setPdfFiles([]);
    setMergedResult(null);
    setError(null);
  };

  const totalPages = pdfFiles.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalSize = pdfFiles.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Hidden file input for adding more PDFs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesSelected(Array.from(e.target.files));
          }
        }}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold border border-cyan-200 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Client-Side PDF Merger</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Merge PDF Documents Online
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Combine multiple PDF files into a single organized document. Rearrange pages, check page counts, and merge securely with zero server uploads.
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
        {pdfFiles.length === 0 ? (
          <div>
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept="application/pdf,.pdf"
              acceptLabel="PDF Documents (.pdf)"
              multiple={true}
              maxSizeMB={50}
              iconType="pdf"
              title="Upload PDFs to merge"
              subtitle="Select 2 or more PDF documents to combine into a single file in your browser."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {pdfFiles.length} PDF {pdfFiles.length === 1 ? 'File' : 'Files'} Selected ({totalPages} Pages Total)
                  </div>
                  <div className="text-xs text-slate-500">
                    Total combined size: {formatBytes(totalSize)} • Drag rows to reorder
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
                  <span>Add More PDFs</span>
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

            {/* Document Output Settings */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Merged PDF Filename
                </label>
                <p className="text-xs text-slate-500">
                  Choose the name for your merged output file
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                  placeholder="merged-document"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                  .pdf
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl">
                {error}
              </div>
            )}

            {/* List of PDFs with Drag & Reorder */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Merge Sequence (Top to Bottom)
                </span>
                <span className="text-xs text-slate-400">
                  Drag items or use arrow controls
                </span>
              </div>

              <div className="space-y-2.5">
                {pdfFiles.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`group bg-white border rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all cursor-move ${
                      draggedIndex === index ? 'opacity-40 border-cyan-500 bg-cyan-50/50' : 'border-slate-200 hover:border-cyan-300'
                    }`}
                  >
                    {/* Left: Drag Handle, Number, Icon & File Details */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
                        <GripVertical className="w-4 h-4 shrink-0" />
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                            {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                          </span>
                          <span>•</span>
                          <span>{formatBytes(item.size)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Up/Down buttons and Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        title="Move earlier"
                        className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === pdfFiles.length - 1}
                        title="Move later"
                        className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-px bg-slate-200 mx-1" />

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(item.id)}
                        title="Remove file"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merge Progress Status */}
            {isMerging && (
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-center gap-3 text-cyan-900 text-sm font-medium animate-pulse">
                <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
                <span>{progressStatus || 'Combining PDF files in your browser...'}</span>
              </div>
            )}

            {/* Success Ready State */}
            {mergedResult && !isMerging && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-emerald-900">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">
                      PDFs Successfully Merged! ({formatBytes(mergedResult.size)})
                    </div>
                    <div className="text-xs text-emerald-700">
                      Combined {pdfFiles.length} files into a single {mergedResult.pageCount}-page PDF document.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Merged PDF</span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="merge-pdf-action-btn"
                onClick={mergedResult ? handleDownload : handleMerge}
                disabled={isMerging || pdfFiles.length === 0}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-50 text-white font-bold text-base shadow-md shadow-cyan-200 transition-all flex items-center justify-center gap-2"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Merging PDF Documents...</span>
                  </>
                ) : mergedResult ? (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Merged PDF ({mergedResult.pageCount} Pages)</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-5 h-5" />
                    <span>Merge {pdfFiles.length} PDF {pdfFiles.length === 1 ? 'File' : 'Files'} ({totalPages} Pages)</span>
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

      {/* Related Tools */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Related Everyday Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => {
              onSelectTool('compress-pdf');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-emerald-600">Compress PDF</h4>
            <p className="text-xs text-slate-500">Shrink your newly merged PDF for email and web uploading.</p>
          </button>

          <button
            onClick={() => {
              onSelectTool('image-to-pdf');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-purple-600">Image to PDF</h4>
            <p className="text-xs text-slate-500">Convert JPG, PNG, and WebP photos into clean PDF pages.</p>
          </button>

          <button
            onClick={() => {
              onSelectTool('compress-image');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-blue-600">Compress Image</h4>
            <p className="text-xs text-slate-500">Reduce picture sizes up to 90% in your browser.</p>
          </button>
        </div>
      </div>

      {/* SEO Section */}
      <div className="mt-14 pt-10 border-t border-slate-200 text-slate-600 space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">
          Combine Multiple PDF Files Safely & In-Browser
        </h2>
        <p>
          FileFixer.online allows you to join multiple PDF documents into one single comprehensive file directly inside your browser. Reorder files as needed, inspect page counts, and download the merged output with 100% privacy and zero server uploads.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 p-3.5 rounded-xl border border-cyan-200">
          <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-600" />
          <span>Zero Data Retention: File streams are merged directly in your device's memory using standard WebAssembly & pdf-lib.</span>
        </div>
      </div>
    </div>
  );
};
