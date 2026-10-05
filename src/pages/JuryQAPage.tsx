import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { juryQuestions } from '../data/juryQuestionsData';
import { JuryQuestion } from '../types';

export const JuryQAPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('jq-01');

  const categories = ['ALL', 'Concurrency', 'Data & Storage', 'Reliability', 'Scalability', 'Architecture'];

  const filtered = juryQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.shortAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.deepDive.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || q.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-xs font-mono font-bold uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Section 37: Hackathon Jury Defense</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Jury Q&A Defense Directory (16 Core Questions)
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive, technically defensible answers to the toughest questions hackathon judges ask regarding bottlenecks, CAP theorem boundaries, failover mechanisms, and overselling prevention.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#0a0f1d] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search judge questions, SQL, Redis, bottlenecks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded ? 'border-purple-500/50 bg-[#0c1222] shadow-lg shadow-purple-950/20' : 'border-slate-800 bg-[#0a0f1d] hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left p-5 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">{item.id.toUpperCase()}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                    {item.question}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans line-clamp-2">
                    &rarr; <strong className="text-cyan-400">Short Answer:</strong> {item.shortAnswer}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-850 space-y-4 text-xs font-mono animate-fade-in">
                  {/* Deep Dive */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">
                      Engineering Deep-Dive & Mechanics:
                    </span>
                    <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      {item.deepDive}
                    </p>
                  </div>

                  {/* Architectural Proof & Key Metric */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-emerald-400 uppercase font-bold text-[10px] block">Architectural Proof:</span>
                      <p className="text-slate-200 text-[11px] font-sans">{item.architecturalProof}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-cyan-400 uppercase font-bold text-[10px] block">Key Defense Metric:</span>
                      <p className="text-slate-200 text-[11px] font-sans">{item.keyMetric}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
