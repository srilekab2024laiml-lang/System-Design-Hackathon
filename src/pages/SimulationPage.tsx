import React from 'react';
import { PlayCircle, ShieldCheck, Zap } from 'lucide-react';
import { SimulationDashboard } from '../components/simulation/SimulationDashboard';

export const SimulationPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase">
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Section 33 & 34: Live Deterministic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Live Flash Sale Concurrency Simulator
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Test the distributed system with 10,000 virtual customers competing for 100 units. Adjust payment declines, network drops, and order service outages in real time. Inspect live millisecond event logs.
        </p>
      </div>

      {/* Main Simulation Dashboard */}
      <SimulationDashboard />
    </div>
  );
};
