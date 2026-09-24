import React from 'react';
import { FileCheck2, ShieldCheck, Lock, Zap, Sparkles } from 'lucide-react';
import { ToolId } from '../types';

interface FooterProps {
  onSelectTool: (id: ToolId | null) => void;
  onOpenPrivacyModal: () => void;
  onOpenAboutModal: () => void;
  onOpenProModal: () => void;
  onScrollToFaq: () => void;
  onNavigatePricing?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTool,
  onOpenPrivacyModal,
  onOpenAboutModal,
  onOpenProModal,
  onScrollToFaq,
  onNavigatePricing,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-sm">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                FileFixer<span className="text-indigo-400">.online</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Fast, free, and privacy-focused file utility tools. Compress, resize, convert, and merge your everyday images and PDFs directly in your browser.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Client-Side Processing</span>
            </div>
          </div>

          {/* Quick Tools Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectTool('compress-image');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Compress Image (JPG, PNG, WebP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('resize-image');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Resize Image (Pixels & Presets)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('image-to-pdf');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Image to PDF (JPG, PNG, WebP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('jpg-to-pdf');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  JPG to PDF Converter
                </button>
              </li>
            </ul>
          </div>

          {/* PDF Tools & Pricing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              PDF Tools & Plans
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectTool('merge-pdf');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Merge PDF Documents
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('compress-pdf');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigatePricing) onNavigatePricing();
                    else onOpenProModal();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pricing Plans (From ₹39)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Privacy & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Zero Server Uploads</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAboutModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  How Browser Processing Works
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToFaq}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} FileFixer.online. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacyModal} className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenAboutModal} className="hover:text-slate-400 transition-colors">
              Terms of Use
            </button>
            <span>•</span>
            <button onClick={onScrollToFaq} className="hover:text-slate-400 transition-colors">
              Help / FAQ
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

