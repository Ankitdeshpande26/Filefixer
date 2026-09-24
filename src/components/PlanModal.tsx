import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldCheck, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PricingPlan } from '../types';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  onStartFree?: () => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onStartFree,
}) => {
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !selectedPlan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setEmail('');
    onClose();
  };

  if (selectedPlan.id === 'free') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            You're on the Free Plan!
          </h3>
          <p className="text-sm text-slate-600 mt-1 mb-5 leading-relaxed">
            Enjoy full access to everyday image compression, resizing, JPG to PDF, and PDF tools directly in your browser with zero registration needed.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-700">
            {selectedPlan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              handleClose();
              if (onStartFree) onStartFree();
            }}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            Start Using Tools Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase tracking-wider">
                {selectedPlan.name} Plan
              </span>
              {selectedPlan.popular && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                  ★ Most Popular
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-2xl font-extrabold text-slate-900">
                {selectedPlan.price}
              </h3>
              <span className="text-slate-500 text-sm font-medium">
                {selectedPlan.period} (Billed Monthly)
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-5">
              {selectedPlan.description}
            </p>

            {/* Features summary */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 mb-5 space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-1">
                Included in this plan:
              </span>
              {selectedPlan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Payment Integration Ready UI */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Preferred Payment Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'card', label: 'Cards (Visa/MC)' },
                    { id: 'netbanking', label: 'NetBanking' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        paymentMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Proceed to {selectedPlan.name} Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted checkout gateway • Cancel anytime with 1-click</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Checkout Gateway Ready
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              We've registered your interest for the <span className="font-bold text-indigo-600">{selectedPlan.name} ({selectedPlan.price}{selectedPlan.period})</span> plan under <span className="font-semibold text-slate-800">{email}</span>.
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 text-left space-y-1">
              <div className="font-bold text-slate-800">Next Steps:</div>
              <div>• Our billing gateway will securely notify your email with your instant activation link.</div>
              <div>• All current tools remain 100% free and functional in the meantime!</div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all"
            >
              Continue to FileFixer Tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
