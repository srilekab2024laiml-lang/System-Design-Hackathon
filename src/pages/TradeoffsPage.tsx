import React from 'react';
import { Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { tradeOffsData } from '../data/tradeOffsData';

export const TradeoffsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Scale className="w-3.5 h-3.5" />
          <span>Section 35: System Design Trade-Offs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Architectural Trade-Offs Analysis
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Every architecture is an exercise in managing trade-offs. Here is the rigorous engineering rationale explaining why we selected each technology, and the explicit compromises accepted.
        </p>
      </div>

      {/* Trade-Offs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tradeOffsData.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono">
                {item.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                  <span className="text-emerald-400 font-bold uppercase block text-[10px]">Decision Selected</span>
                  <div className="text-slate-200 mt-1">{item.decision}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Alternative Evaluated</span>
                  <div className="text-slate-300 mt-1">{item.alternative}</div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                  Why Chosen:
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.whyChosen}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-850 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-bold uppercase text-[10px] block">Core Benefit:</span>
                <p className="text-slate-300 font-sans mt-0.5">{item.benefit}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold uppercase text-[10px] block">Accepted Trade-Off:</span>
                <p className="text-slate-300 font-sans mt-0.5">{item.tradeOff}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
