import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileUp, AlertCircle, Image as ImageIcon, FileText } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  acceptLabel: string;
  multiple?: boolean;
  maxSizeMB?: number;
  iconType?: 'image' | 'pdf' | 'mixed';
  title?: string;
  subtitle?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  accept,
  acceptLabel,
  multiple = false,
  maxSizeMB = 50,
  iconType = 'image',
  title,
  subtitle,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFiles = (rawFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const fileList = Array.from(rawFiles);
    if (fileList.length === 0) return;

    for (const file of fileList) {
      // Size check
      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" exceeds the ${maxSizeMB}MB browser limit.`);
        continue;
      }

      // Format check if accept is given
      if (accept) {
        const acceptPatterns = accept.split(',').map((p) => p.trim().toLowerCase());
        const ext = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
        const mime = file.type.toLowerCase();

        const matches = acceptPatterns.some((pattern) => {
          if (pattern.startsWith('.')) {
            return ext === pattern;
          }
          if (pattern.endsWith('/*')) {
            const prefix = pattern.replace('/*', '');
            return mime.startsWith(prefix);
          }
          return mime === pattern;
        });

        if (!matches) {
          setErrorMessage(`"${file.name}" is not a supported file format (${acceptLabel}).`);
          continue;
        }
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (!multiple) {
        onFilesSelected([validFiles[0]]);
      } else {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
    // Reset so the same file can be selected again
    e.target.value = '';
  };

  // Support clipboard paste for ease on desktop / screenshots
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        validateAndProcessFiles(e.clipboardData.files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [accept, maxSizeMB, multiple]);

  return (
    <div className="w-full">
      <div
        id="file-dropzone-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 sm:p-12 text-center flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/80 scale-[0.99] shadow-inner'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/70 shadow-sm hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload file input"
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${
            isDragOver
              ? 'bg-indigo-600 text-white'
              : 'bg-gradient-to-tr from-indigo-50 to-blue-50 text-indigo-600 border border-indigo-100'
          }`}
        >
          {iconType === 'image' ? (
            <ImageIcon className="w-8 h-8" />
          ) : iconType === 'pdf' ? (
            <FileText className="w-8 h-8" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
          {title || (multiple ? 'Drop files here or click to browse' : 'Drop your file here or click to browse')}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 max-w-md mb-4 leading-relaxed">
          {subtitle || (multiple ? 'Select one or more files from your device to get started.' : 'Select a file from your computer or phone to start instant processing.')}
        </p>

        {/* Action Button */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 group-hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all">
          <FileUp className="w-4 h-4" />
          <span>{multiple ? 'Choose Files' : 'Choose File'}</span>
        </div>

        {/* Format badge & privacy notice */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-600 border border-slate-200">
            {acceptLabel}
          </span>
          <span>•</span>
          <span>Max {maxSizeMB}MB</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">100% In-Browser Private</span>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-rose-600 hover:text-rose-900 font-bold px-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
