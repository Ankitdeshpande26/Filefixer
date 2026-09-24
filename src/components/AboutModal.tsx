import React from 'react';
import { X, FileCheck2, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPro: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenPro }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">About FileFixer.online</h3>
              <p className="text-xs text-slate-500">Fix. Convert. Compress.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>FileFixer.online</strong> was born out of a simple frustration: everyday tasks like resizing an image, compressing a PDF for email, or combining photos into a document should not require bloated software, subscription paywalls, or uploading private files to unknown servers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-1">
                <Zap className="w-4 h-4" />
                <span>Lightning Fast</span>
              </div>
              <p className="text-xs text-slate-500">Instant client-side execution with zero queue times or network delays.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
                <Shield className="w-4 h-4" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-xs text-slate-500">Your documents stay 100% on your device at all times.</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Our Core Pillars</h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span><strong>No Account Needed:</strong> Jump straight into work without signing up.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span><strong>Mobile First:</strong> Optimized touch targets and responsive UI on all screen sizes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span><strong>High-Precision Output:</strong> Exact quality controls, dimension locking, and clean PDF generation.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenPro();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Join FileFixer Pro waitlist</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
