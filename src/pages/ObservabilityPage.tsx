import React from 'react';
import { Activity, ShieldCheck, Database, Radio, Clock } from 'lucide-react';
import { TelemetryDashboard } from '../components/observability/TelemetryDashboard';

export const ObservabilityPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Activity className="w-3.5 h-3.5" />
          <span>Section 30: System Observability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Telemetry & Observability Dashboard
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Simulated live engineering metrics tracking peak requests/sec, P95 and P99 latency percentiles, database connection pools, and Kafka Dead Letter Queues (DLQ).
        </p>
      </div>

      {/* Main Telemetry Dashboard */}
      <TelemetryDashboard />
    </div>
  );
};
