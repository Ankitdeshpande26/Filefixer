import React from 'react';
import { Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { PRICING_PLANS } from '../data/toolsData';
import { PricingPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => {
          const isPro = plan.popular;

          return (
            <div
              key={plan.id}
              id={`pricing-card-${plan.id}`}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                isPro
                  ? 'bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl shadow-indigo-200/50 border-2 border-indigo-500 scale-100 lg:scale-105 z-10'
                  : 'bg-white text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[11px] font-extrabold shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div>
                {/* Plan Title & description */}
                <div className="mb-4">
                  <h3 className={`text-xl font-bold ${isPro ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 min-h-[32px] ${isPro ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-100/10">
                  <span className={`text-4xl font-black tracking-tight ${isPro ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-xs font-semibold ${isPro ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                    isPro ? 'text-indigo-300' : 'text-slate-400'
                  }`}>
                    What's included:
                  </span>

                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPro
                            ? 'bg-indigo-500/30 text-indigo-300'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span
                        className={`leading-tight ${
                          isPro ? 'text-slate-200 font-medium' : 'text-slate-700'
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  id={`cta-btn-${plan.id}`}
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isPro
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-400'
                      : plan.id === 'free'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-800'
                  }`}
                >
                  {plan.id === 'pro' && <Zap className="w-4 h-4 fill-white" />}
                  <span>{plan.ctaText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
