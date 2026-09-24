import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  HelpCircle, 
  ChevronRight, 
  Lock, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { PricingSection } from './PricingSection';
import { PricingPlan, ToolId } from '../types';
import { FAQ_DATA } from '../data/toolsData';

interface PricingPageProps {
  onSelectPlan: (plan: PricingPlan) => void;
  onSelectTool: (id: ToolId) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, onSelectTool }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Simple, Transparent Pricing for Everyone</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Pick the plan that fits your file needs
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          From quick everyday conversions to power-user batch workloads. Zero surprise charges. Cancel anytime.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <PricingSection onSelectPlan={onSelectPlan} />
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-white">
              100% Privacy and Security Included in All Plans
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              All tools run client-side on your device. We never store or inspect your confidential images or PDFs.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onSelectTool('compress-image');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <span>Try Free Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FAQ for Pricing */}
      <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Common questions about FileFixer plans and billing
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              Can I use the tools without paying anything?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes! Our Free plan (₹0/mo) includes free image compression, resizing, JPG to PDF conversions, and PDF tools directly in your browser.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              What payment methods are supported?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We support all popular payment methods in India and globally, including UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards (Visa, MasterCard, RuPay), and NetBanking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              Are my files safe when upgrading to paid tiers?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Absolutely. Our architecture remains 100% client-side privacy-first. Upgrading gives you higher hardware stream allocations, no ads, and batch queues without compromising your confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
