import React, { useState } from 'react';
import { FileSpreadsheet, CheckCircle2, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';
import { requirements } from '../data/requirementsData';
import { Requirement } from '../types';
import { SourceBadge } from '../components/common/SourceBadge';

export const RequirementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'functional' | 'non-functional'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'brief' | 'decision' | 'assumption'>('all');

  const filtered = requirements.filter(r => {
    const matchesTab = activeTab === 'all' || r.category === activeTab;
    const matchesSource = sourceFilter === 'all' || r.source === sourceFilter;
    return matchesTab && matchesSource;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Section 8 & 56: System Specifications</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Functional & Non-Functional Requirements
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Rigorous taxonomy distinguishing requirements directly mandated by the hackathon brief from our technical architectural decisions and explicit assumptions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#0a0f1d] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2">
          {(['all', 'functional', 'non-functional'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Requirements' : `${tab} (${requirements.filter(r => r.category === tab).length})`}
            </button>
          ))}
        </div>

        {/* Provenance Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Source:</span>
          {(['all', 'brief', 'decision', 'assumption'] as const).map(src => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-colors ${
                sourceFilter === src
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {src === 'brief' ? '● Brief' : src === 'decision' ? '◆ Decision' : src === 'assumption' ? '▲ Assumption' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {req.id}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    req.priority.startsWith('P0') ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    req.priority.startsWith('P1') ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {req.priority}
                  </span>
                  <SourceBadge source={req.source} />
                </div>
              </div>

              <h3 className="text-sm font-bold text-white font-mono">
                {req.title}
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {req.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs font-mono text-cyan-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                Architectural Implication:
              </span>
              {req.architecturalImplication}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
