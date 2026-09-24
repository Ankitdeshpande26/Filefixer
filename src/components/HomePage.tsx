import React, { useState } from 'react';
import { 
  Minimize2, 
  Maximize2, 
  FileText, 
  FileArchive, 
  Images,
  Layers,
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Zap, 
  ChevronDown, 
  Sparkles, 
  FileCheck2 
} from 'lucide-react';
import { TOOLS_DATA, FAQ_DATA } from '../data/toolsData';
import { PricingPlan, ToolId } from '../types';
import { AdPlacement } from './AdPlacement';
import { PricingSection } from './PricingSection';

interface HomePageProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
  onOpenPrivacy: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
  onNavigatePricing: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onSelectTool, 
  onOpenPro, 
  onOpenPrivacy,
  onSelectPlan,
  onNavigatePricing
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Minimize2':
        return <Minimize2 className="w-6 h-6" />;
      case 'Maximize2':
        return <Maximize2 className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'FileArchive':
        return <FileArchive className="w-6 h-6" />;
      case 'Images':
        return <Images className="w-6 h-6" />;
      case 'Layers':
        return <Layers className="w-6 h-6" />;
      default:
        return <FileCheck2 className="w-6 h-6" />;
    }
  };

  const getToolTheme = (id: ToolId) => {
    switch (id) {
      case 'compress-image':
        return {
          iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
          hoverBorder: 'hover:border-blue-500',
          btnBg: 'bg-blue-600 hover:bg-blue-700',
          badgeBg: 'bg-blue-100 text-blue-800',
        };
      case 'resize-image':
        return {
          iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
          hoverBorder: 'hover:border-indigo-500',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700',
          badgeBg: 'bg-indigo-100 text-indigo-800',
        };
      case 'jpg-to-pdf':
        return {
          iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
          hoverBorder: 'hover:border-amber-500',
          btnBg: 'bg-amber-600 hover:bg-amber-700',
          badgeBg: 'bg-amber-100 text-amber-800',
        };
      case 'compress-pdf':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
          hoverBorder: 'hover:border-emerald-500',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700',
          badgeBg: 'bg-emerald-100 text-emerald-800',
        };
      case 'image-to-pdf':
        return {
          iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
          hoverBorder: 'hover:border-purple-500',
          btnBg: 'bg-purple-600 hover:bg-purple-700',
          badgeBg: 'bg-purple-100 text-purple-800',
        };
      case 'merge-pdf':
        return {
          iconBg: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
          hoverBorder: 'hover:border-cyan-500',
          btnBg: 'bg-cyan-600 hover:bg-cyan-700',
          badgeBg: 'bg-cyan-100 text-cyan-800',
        };
    }
  };

  return (
    <div className="w-full space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Pills */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% In-Browser & Private • Free Forever</span>
        </div>

        {/* Hero Headings */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
            FileFixer<span className="text-indigo-600">.online</span>
          </h1>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Fix. Convert. Compress.
          </p>
        </div>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Simple online tools for your everyday files. Compress images, resize photos, convert any image to PDF, merge PDF files, and optimize documents directly in your browser without uploading to external servers.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              const grid = document.getElementById('all-tools-grid');
              grid?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <span>Explore All 6 Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigatePricing}
            className="px-5 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>View Pricing Plans</span>
          </button>
        </div>
      </section>

      {/* 6 Large Tool Cards Grid */}
      <section id="all-tools-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everyday File Utilities
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pick a tool to get started instantly — 100% private, no login required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS_DATA.map((tool) => {
            const theme = getToolTheme(tool.id);
            return (
              <div
                key={tool.id}
                id={`tool-card-${tool.id}`}
                className={`group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl ${theme.hoverBorder} transition-all p-6 sm:p-7 flex flex-col justify-between`}
              >
                <div>
                  {/* Top line with Icon and Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${theme.iconBg} shadow-sm`}
                    >
                      {getToolIcon(tool.iconName)}
                    </div>
                    {tool.badge && (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${theme.badgeBg}`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    {tool.tagline}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>

                {/* Card Footer: Formats & CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {tool.acceptedFormats}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTool(tool.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white ${theme.btnBg} shadow-sm transition-all focus:outline-none`}
                  >
                    <span>Use Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ad Placement */}
      <div className="max-w-5xl mx-auto px-4">
        <AdPlacement slot="leaderboard" onOpenPro={onOpenPro} />
      </div>

      {/* "Your files stay private" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Your files stay private. Always.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlike other online converters that upload your documents and pictures to third-party cloud servers, FileFixer.online processes everything directly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Server Uploads</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Files never leave your computer or phone. No network uploads means zero risk of data interception or leaks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Browser-Powered Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern HTML5 Canvas, WebAssembly, and native memory streams compress and render pages at hardware speed.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Works Offline</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once loaded, the tools can process your images and PDFs even if your internet connection temporarily drops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section on Homepage */}
      <section id="homepage-pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Transparent Pricing Plans</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple Monthly Plans
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            Choose the plan that suits your personal or business file workflow.
          </p>
        </div>

        <PricingSection onSelectPlan={onSelectPlan} />
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Everything you need to know about FileFixer.online
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

