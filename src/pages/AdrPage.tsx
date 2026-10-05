import React, { useState } from 'react';
import { FileText, CheckCircle2, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { architectureDecisionRecords } from '../data/adrData';
import { ADR } from '../types';

export const AdrPage: React.FC = () => {
  const [selectedAdr, setSelectedAdr] = useState<ADR>(architectureDecisionRecords[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span>Section 36: Architecture Decision Records</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Architecture Decision Records (ADR-001 &ndash; 006)
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Formal engineering decision logs documenting the context, evaluated alternatives, decisions, and long-term consequences of our distributed system design.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left ADR Selector */}
        <div className="lg:col-span-4 space-y-2">
          {architectureDecisionRecords.map((adr) => {
            const isSelected = selectedAdr.id === adr.id;
            return (
              <button
                key={adr.id}
                onClick={() => setSelectedAdr(adr)}
                className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all space-y-1.5 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 text-white ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">{adr.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    {adr.status}
                  </span>
                </div>
                <div className="font-bold text-slate-200 text-sm font-sans line-clamp-1">
                  {adr.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 font-sans">
                  {adr.decision}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right ADR Deep Dive */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 lg:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 block">{selectedAdr.id}</span>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedAdr.title}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              STATUS: {selectedAdr.status.toUpperCase()}
            </span>
          </div>

          {/* Context */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400">1. Context & Problem Statement</h4>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {selectedAdr.context}
            </p>
          </div>

          {/* Decision */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-cyan-400">2. Decision Taken</h4>
            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed bg-cyan-950/20 p-4 rounded-xl border border-cyan-900/40">
              {selectedAdr.decision}
            </p>
          </div>

          {/* Alternatives */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400">3. Alternatives Evaluated</h4>
            <div className="space-y-2">
              {selectedAdr.alternatives.map((alt, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono">
                  <div className="font-bold text-white mb-1">&bull; {alt.option}</div>
                  <div className="text-emerald-400 text-[11px]"><strong className="text-slate-400">Pros:</strong> {alt.pros}</div>
                  <div className="text-rose-400 text-[11px]"><strong className="text-slate-400">Cons:</strong> {alt.cons}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason & Consequences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-cyan-400 uppercase font-bold text-[10px] block">4. Justification & Engineering Rationale</span>
              <p className="text-slate-300 font-sans leading-relaxed">{selectedAdr.reason}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-emerald-400 uppercase font-bold text-[10px] block">5. Architecture Consequences</span>
              <p className="text-slate-300 font-sans leading-relaxed">{selectedAdr.consequences}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
