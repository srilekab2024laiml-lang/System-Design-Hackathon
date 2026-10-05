import React from 'react';
import {
  Users,
  Zap,
  Boxes,
  ShieldAlert,
  AlertTriangle,
  Lock,
  CreditCard,
  PackageCheck,
  Activity,
  ArrowDown,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { GuaranteeCard } from '../components/inventory/GuaranteeCard';

export const ProblemPage: React.FC = () => {
  const challenges = [
    {
      num: '01',
      title: 'Extreme Concurrency & Race Conditions',
      icon: Users,
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      summary: '10,000 requests arrive within 100ms at T=0. In naive code (SELECT stock -> IF stock > 0 -> UPDATE stock - 1), hundreds of parallel threads read stock = 1 before any write commits, triggering catastrophic overselling.',
      architecturalMitigation: 'Single-statement atomic conditional update inside database engine: WHERE available >= 1.'
    },
    {
      num: '02',
      title: 'Strict Inventory Consistency (Zero Oversell)',
      icon: Boxes,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      summary: 'Physical warehouse only possesses 100 items. Confirming even 101 sales violates financial contracts and damages customer trust.',
      architecturalMitigation: 'PostgreSQL authoritative store of record with CHECK (available_quantity >= 0) and row-level serialization.'
    },
    {
      num: '03',
      title: 'Payment Gateway Latency & Timeouts',
      icon: CreditCard,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      summary: 'External credit card processing takes 1,000 to 3,000ms. Holding database locks across 10,000 users during bank calls would exhaust connection pools in milliseconds.',
      architecturalMitigation: 'Two-phase reservation: 80ms fast lock grants 5-minute lease; banking call occurs out-of-band.'
    },
    {
      num: '04',
      title: 'Order Reliability & Dual-Write Vulnerability',
      icon: PackageCheck,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      summary: 'If customer credit card is charged, but the Order Service crashes or network drops before the order record is written, customer money is taken with zero order generated (Orphaned Payment).',
      architecturalMitigation: 'Transactional Outbox pattern commits payment AND outbox event in the same local ACID transaction.'
    },
    {
      num: '05',
      title: 'Volumetric Traffic Spikes & DDoS Protection',
      icon: Activity,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
      summary: 'Automated scalper bots and thousands of frantic browser refreshes threaten to overwhelm origin compute and database socket limits.',
      architecturalMitigation: 'Multi-tier shedding: Cloudflare WAF, Turnstile CAPTCHA, Envoy token-bucket rate limiters, and PgBouncer connection multiplexing.'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-mono font-bold uppercase">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>The Core Engineering Challenge</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          The High-Scale Flash Sale Problem
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Why traditional web applications catastrophically fail during high-concurrency inventory drops, and how to construct a provably correct solution.
        </p>
      </div>

      {/* Visual Invariant Flow (Prompt Section 7) */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-8 text-center space-y-4">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
          The Flash Sale Funnel Dynamic
        </h3>

        <div className="flex flex-col items-center justify-center space-y-3 font-mono">
          <div className="px-6 py-3 rounded-2xl bg-cyan-950/80 border border-cyan-500 text-cyan-300 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-cyan-950/50">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>10,000 CONCURRENT USERS AT T=0</span>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-600 animate-bounce" />

          <div className="px-6 py-3 rounded-2xl bg-amber-950/80 border border-amber-500 text-amber-300 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-amber-950/50">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>HIGH-CONTENTION "BUY NOW" CLICK BURST</span>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-600" />

          <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-sm sm:text-base flex items-center gap-2">
            <span>SCARCE PRODUCT X</span>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-600" />

          <div className="px-6 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-950/50">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <span>EXACTLY 100 PHYSICAL UNITS AVAILABLE</span>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-600" />

          <div className="px-6 py-3 rounded-2xl bg-emerald-900/60 border-2 border-emerald-400 text-white font-extrabold text-base sm:text-lg flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
            <span>MAXIMUM 100 SALES — ZERO ALLOWED OVERSELL</span>
          </div>
        </div>
      </div>

      {/* Prominent Guarantee Card */}
      <GuaranteeCard />

      {/* 5 Core Challenges */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <span>The 5 Distributed Systems Challenges</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.num} className="p-5 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${c.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-mono">
                      Challenge #{c.num}: {c.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {c.summary}
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-cyan-300">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                    Architectural Mitigation:
                  </span>
                  {c.architecturalMitigation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
