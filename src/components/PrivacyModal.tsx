import React from 'react';
import { X, ShieldCheck, Lock, Cpu, EyeOff, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Files Stay Private</h3>
              <p className="text-xs text-slate-500">100% In-Browser Execution Guarantee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-normal">
              <strong>Zero-Knowledge Architecture:</strong> When you use FileFixer.online, your files are never transmitted to our servers or any 3rd party API. All compression, resizing, and conversion happens entirely in your local browser sandbox.
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">HTML5 Canvas & WebAssembly</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Images and PDFs are loaded into your device's memory using HTML5 Canvas and native JavaScript libraries (pdf-lib, jsPDF). Calculations leverage your computer or phone's CPU/GPU directly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">No Server Logs or Storage</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Since no files are sent across the network, there are no databases, temporary S3 buckets, or storage servers holding your documents. Once you close the tab, all memory is instantly cleared.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Safe for Confidential Files</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  You can safely compress sensitive contracts, tax forms, IDs, and personal family photographs without worrying about third-party data breaches.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};
