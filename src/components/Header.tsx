import React, { useState } from 'react';
import { 
  FileCheck2, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  Minimize2, 
  Maximize2, 
  FileText, 
  FileArchive, 
  Images,
  Layers,
  ShieldCheck, 
  HelpCircle, 
  Info,
  CreditCard
} from 'lucide-react';
import { ToolId } from '../types';

interface HeaderProps {
  currentTool: ToolId | null;
  onSelectTool: (toolId: ToolId | null) => void;
  onOpenProModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenAboutModal: () => void;
  onScrollToFaq: () => void;
  onNavigatePricing?: () => void;
  isPricingPage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTool,
  onSelectTool,
  onOpenProModal,
  onOpenPrivacyModal,
  onOpenAboutModal,
  onScrollToFaq,
  onNavigatePricing,
  isPricingPage = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const handleToolClick = (id: ToolId) => {
    onSelectTool(id);
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    onSelectTool(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePricingClick = () => {
    if (onNavigatePricing) {
      onNavigatePricing();
    } else {
      onOpenProModal();
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            id="header-logo-btn"
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">FileFixer<span className="text-indigo-600 font-extrabold">.online</span></span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider -mt-1 hidden sm:block">
                Fix. Convert. Compress.
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                id="header-tools-dropdown-btn"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentTool ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <span>All Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-1 gap-0.5">
                  <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Image & PDF Utilities
                  </div>
                  <button
                    onClick={() => handleToolClick('compress-image')}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Minimize2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Compress Image</div>
                      <div className="text-[11px] text-slate-500">Reduce JPG, PNG, WebP</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleToolClick('resize-image')}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-700 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Resize Image</div>
                      <div className="text-[11px] text-slate-500">Custom px & 1080p presets</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleToolClick('image-to-pdf')}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-purple-50/80 hover:text-purple-700 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                      <Images className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Image to PDF</div>
                      <div className="text-[11px] text-slate-500">JPG, PNG, WebP to PDF with layout</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleToolClick('merge-pdf')}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-cyan-50/80 hover:text-cyan-700 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Merge PDF</div>
                      <div className="text-[11px] text-slate-500">Combine multiple PDF documents</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleToolClick('jpg-to-pdf')}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-amber-50/80 hover:text-amber-700 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">JPG to PDF</div>
                      <div className="text-[11px] text-slate-500">Fast JPG image compilation</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleToolClick('compress-pdf')}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <FileArchive className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Compress PDF</div>
                      <div className="text-[11px] text-slate-500">Shrink PDF document size</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Pricing Page Link */}
            <button
              id="header-pricing-btn"
              onClick={handlePricingClick}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isPricingPage ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <span>Pricing</span>
            </button>

            <button
              id="header-privacy-btn"
              onClick={onOpenPrivacyModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy</span>
            </button>

            <button
              id="header-faq-btn"
              onClick={onScrollToFaq}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>FAQ</span>
            </button>

            <button
              id="header-about-btn"
              onClick={onOpenAboutModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>About</span>
            </button>
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-pro-btn"
              onClick={handlePricingClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Plans from ₹39/mo</span>
            </button>

            <button
              id="header-use-tools-cta"
              onClick={() => {
                if (currentTool || isPricingPage) {
                  onSelectTool(null);
                } else {
                  const toolsSection = document.getElementById('all-tools-grid');
                  if (toolsSection) {
                    toolsSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onSelectTool('compress-image');
                  }
                }
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm hover:shadow-indigo-200 transition-all focus:outline-none"
            >
              {currentTool || isPricingPage ? 'All Tools' : 'Get Started'}
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-pro-badge"
              onClick={handlePricingClick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Plans</span>
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            All 6 Utilities
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleToolClick('compress-image')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                currentTool === 'compress-image'
                  ? 'border-indigo-500 bg-indigo-50/60 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-slate-50/60 text-slate-800'
              }`}
            >
              <Minimize2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold">Compress Image</span>
            </button>
            <button
              onClick={() => handleToolClick('resize-image')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                currentTool === 'resize-image'
                  ? 'border-indigo-500 bg-indigo-50/60 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-slate-50/60 text-slate-800'
              }`}
            >
              <Maximize2 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold">Resize Image</span>
            </button>
            <button
              onClick={() => handleToolClick('image-to-pdf')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                currentTool === 'image-to-pdf'
                  ? 'border-purple-500 bg-purple-50/60 text-purple-700 font-semibold'
                  : 'border-slate-200 bg-slate-50/60 text-slate-800'
              }`}
            >
              <Images className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold">Image to PDF</span>
            </button>
            <button
              onClick={() => handleToolClick('merge-pdf')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                currentTool === 'merge-pdf'
                  ? 'border-cyan-500 bg-cyan-50/60 text-cyan-700 font-semibold'
                  : 'border-slate-200 bg-slate-50/60 text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-semibold">Merge PDF</span>
            </button>
            <button
              onClick={() => handleToolClick('jpg-to-pdf')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                currentTool === 'jpg-to-pdf'
                  ? 'border-indigo-500 bg-indigo-50/60 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-slate-50/60 text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold">JPG to PDF</span>
            </button>
            <button
              onClick={() => handleToolClick('compress-pdf')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                currentTool === 'compress-pdf'
                  ? 'border-indigo-500 bg-indigo-50/60 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-slate-50/60 text-slate-800'
              }`}
            >
              <FileArchive className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold">Compress PDF</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
            <button
              onClick={handlePricingClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50/70"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Pricing Plans (From ₹39/mo)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivacyModal();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Private (No Uploads)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToFaq();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Frequently Asked Questions</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAboutModal();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>About FileFixer</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

