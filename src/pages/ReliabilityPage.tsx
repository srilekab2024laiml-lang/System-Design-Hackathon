import React from 'react';
import { AlertOctagon, ShieldCheck, Zap } from 'lucide-react';
import { FailureMatrix } from '../components/reliability/FailureMatrix';
import { CircuitBreakerVisualizer } from '../components/reliability/CircuitBreakerVisualizer';

export const ReliabilityPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-mono font-bold uppercase">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Section 28 & 29: Resilience Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Reliability & Failure Recovery Matrix
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive failure scenarios covering database crashes, gateway timeouts, Kafka partitions, and circuit breakers with automated compensation mechanisms.
        </p>
      </div>

      {/* Circuit Breaker Visualizer (Section 29) */}
      <CircuitBreakerVisualizer />

      {/* Failure Matrix (Section 28) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white">
          Comprehensive Failure & Recovery Matrix (11 Scenarios)
        </h2>
        <FailureMatrix />
      </div>
    </div>
  );
};
