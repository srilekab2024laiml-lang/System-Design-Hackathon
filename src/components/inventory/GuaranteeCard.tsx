import React from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const GuaranteeCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-[#071318] p-6 lg:p-8 shadow-2xl emerald-glow">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <ShieldCheck className="w-48 h-48 text-emerald-400" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>NON-NEGOTIABLE CORE GUARANTEE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            INVENTORY ZERO-OVERSELL INVARIANT
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Under any concurrency burst up to 10,000+ simultaneous requests, the system guarantees mathematically that sales never exceed initial physical stock.
          </p>
        </div>

        {/* Big Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-3.5 text-center">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Initial Stock</div>
            <div className="text-2xl font-bold text-white mt-1">100</div>
            <div className="text-[10px] text-slate-500">Configured Units</div>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-center">
            <div className="text-[11px] text-emerald-400 uppercase font-semibold">Successful Sales</div>
            <div className="text-2xl font-bold text-emerald-300 mt-1">&le; 100</div>
            <div className="text-[10px] text-emerald-500">Confirmed Orders</div>
          </div>

          <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-3.5 text-center">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Final Stock</div>
            <div className="text-2xl font-bold text-white mt-1">&ge; 0</div>
            <div className="text-[10px] text-slate-500">Never Negative</div>
          </div>

          <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/60 p-3.5 text-center ring-2 ring-emerald-500/30">
            <div className="text-[11px] text-emerald-400 uppercase font-semibold">Overselling</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">0</div>
            <div className="text-[10px] text-emerald-300 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Guaranteed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
