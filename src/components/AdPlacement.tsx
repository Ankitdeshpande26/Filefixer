import React from 'react';
import { Sparkles } from 'lucide-react';

interface AdPlacementProps {
  slot: 'banner' | 'leaderboard' | 'box';
  onOpenPro?: () => void;
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ slot, onOpenPro, className = '' }) => {
  return (
    <aside aria-label="Sponsored advertisement" className={`w-full my-6 select-none ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300/80 bg-slate-100/60 p-4 text-center">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
          <span>Sponsored Advertisement</span>
          {onOpenPro && (
            <button
              onClick={onOpenPro}
              className="text-indigo-600 hover:text-indigo-700 font-semibold lowercase hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              remove ads with Pro
            </button>
          )}
        </div>

        {slot === 'leaderboard' && (
          <div className="min-h-[85px] sm:min-h-[90px] flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4 rounded-lg bg-white/80 border border-slate-200/60 shadow-xs">
            <div className="text-left flex-1">
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
                Productivity Partner
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                Speed up your daily workflow with zero cloud latency.
              </p>
              <p className="text-xs text-slate-500 hidden sm:block">
                Unlimited browser tools with zero tracking.
              </p>
            </div>
            <button
              onClick={onOpenPro}
              className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Learn More
            </button>
          </div>
        )}

        {slot === 'banner' && (
          <div className="min-h-[70px] flex items-center justify-between gap-4 py-2 px-4 rounded-lg bg-white/80 border border-slate-200/60 shadow-xs">
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800">
                Need batch processing and unlimited file sizes?
              </p>
              <p className="text-[11px] text-slate-500">
                Upgrade to FileFixer Pro for advanced compression control.
              </p>
            </div>
            <button
              onClick={onOpenPro}
              className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              Get Pro
            </button>
          </div>
        )}

        {slot === 'box' && (
          <div className="p-4 rounded-lg bg-white/80 border border-slate-200/60 shadow-xs flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1">Ad Space Available</p>
            <p className="text-[11px] text-slate-500 mb-3">Target privacy-conscious file creators and developers.</p>
            <button
              onClick={onOpenPro}
              className="text-xs font-semibold px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-800"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
