import React, { useState } from 'react';
import { X, Sparkles, Check, Zap, Shield, FileSpreadsheet, Sliders, CheckCircle2 } from 'lucide-react';
import { fireCelebration } from '../utils/fileUtils';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('filefixer_pro_waitlist') || '[]');
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem('filefixer_pro_waitlist', JSON.stringify(existing));
      }
    } catch {
      // ignore localStorage limits
    }

    setIsSubmitted(true);
    setError('');
    fireCelebration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Future-Ready Concept</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FileFixer <span className="text-amber-300">Pro</span>
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            Supercharge your workflow with high-volume batch processing and advanced controls.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Batch Processing</h4>
                <p className="text-xs text-slate-500">Compress or resize 50+ files at once with a single click.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Larger File Limits (Up to 500MB)</h4>
                <p className="text-xs text-slate-500">Seamlessly handle massive RAW photos, blueprints, and scanned documents.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Higher Compression Controls</h4>
                <p className="text-xs text-slate-500">Lossless PNG crunching, CMYK preservation, and exact target KB sizing.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Ad-Free Experience</h4>
                <p className="text-xs text-slate-500">Completely uninterrupted, distraction-free environment for power users.</p>
              </div>
            </div>
          </div>

          {/* Waitlist Form */}
          {isSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center animate-in zoom-in-95 duration-150">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold">You're on the early access list!</h4>
              <p className="text-xs text-emerald-700 mt-1">
                We'll notify you as soon as FileFixer Pro opens for beta testing.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Back to Tools
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="pro-waitlist-email" className="block text-xs font-semibold text-slate-700">
                  Get Early Access & Lifetime Beta Discount
                </label>
                <div className="flex gap-2">
                  <input
                    id="pro-waitlist-email"
                    type="email"
                    placeholder="Enter your work or personal email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm shadow-indigo-200 transition-all shrink-0"
                  >
                    Join Waitlist
                  </button>
                </div>
                {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Zero spam. Free tools will always remain 100% free and client-side.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
