import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, RotateCcw, Play, Clock, Zap, ArrowRight } from 'lucide-react';

export const CircuitBreakerVisualizer: React.FC = () => {
  const [breakerState, setBreakerState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const FAILURE_THRESHOLD = 5;

  const handleSimulateFailure = () => {
    if (breakerState === 'CLOSED') {
      const nextFailures = consecutiveFailures + 1;
      setConsecutiveFailures(nextFailures);

      if (nextFailures >= FAILURE_THRESHOLD) {
        setBreakerState('OPEN');
      }
    } else if (breakerState === 'HALF_OPEN') {
      // Failure in half open trips it back to open
      setBreakerState('OPEN');
    }
  };

  const handleSimulateSuccess = () => {
    if (breakerState === 'HALF_OPEN') {
      // Probe succeeds, resets to CLOSED
      setBreakerState('CLOSED');
      setConsecutiveFailures(0);
    } else if (breakerState === 'CLOSED') {
      setConsecutiveFailures(Math.max(0, consecutiveFailures - 1));
    }
  };

  const handleCooldownTimeout = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setBreakerState('HALF_OPEN');
      setIsSimulating(false);
    }, 1500);
  };

  const handleReset = () => {
    setBreakerState('CLOSED');
    setConsecutiveFailures(0);
    setIsSimulating(false);
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Section 29: Circuit Breaker Pattern</span>
          <h3 className="text-base font-bold text-white mt-1">
            Resilience4j / Envoy Circuit Breaker State Machine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Protects downstream services (Payment Gateway, Inventory DB) from cascading collapse during downstream outages.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Breaker</span>
        </button>
      </div>

      {/* State Flow Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CLOSED State */}
        <div className={`p-4 rounded-xl border transition-all ${
          breakerState === 'CLOSED'
            ? 'border-emerald-500/60 bg-emerald-950/30 ring-2 ring-emerald-500/30'
            : 'border-slate-800 bg-slate-900/50 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-emerald-400">STATE 1: CLOSED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-white">Normal Request Flow</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Requests pass directly to downstream service.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-300">
            Consecutive Failures: <strong className="text-amber-400">{consecutiveFailures} / {FAILURE_THRESHOLD}</strong>
          </div>
        </div>

        {/* OPEN State */}
        <div className={`p-4 rounded-xl border transition-all ${
          breakerState === 'OPEN'
            ? 'border-rose-500/60 bg-rose-950/30 ring-2 ring-rose-500/30'
            : 'border-slate-800 bg-slate-900/50 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-rose-400">STATE 2: OPEN</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xs font-bold text-white">Fail-Fast Mode (HTTP 503)</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Zero downstream calls made. Requests fast-fail in &lt;2ms to give downstream time to recover.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-300">
            Cooldown window: <strong>10 Seconds</strong>
          </div>
        </div>

        {/* HALF_OPEN State */}
        <div className={`p-4 rounded-xl border transition-all ${
          breakerState === 'HALF_OPEN'
            ? 'border-amber-500/60 bg-amber-950/30 ring-2 ring-amber-500/30'
            : 'border-slate-800 bg-slate-900/50 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-amber-400">STATE 3: HALF-OPEN</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xs font-bold text-white">Trial Probe Request</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Allows 1 trial request through. If success &rarr; CLOSED. If failure &rarr; back to OPEN.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-300">
            Probe Status: <strong>Awaiting Probe Result</strong>
          </div>
        </div>
      </div>

      {/* Interactive Trigger Controls */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase mr-2">
          Test Actions:
        </span>

        {breakerState === 'CLOSED' && (
          <button
            onClick={handleSimulateFailure}
            className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Simulate 1 Downstream Failure ({consecutiveFailures + 1}/{FAILURE_THRESHOLD})</span>
          </button>
        )}

        {breakerState === 'OPEN' && (
          <button
            onClick={handleCooldownTimeout}
            disabled={isSimulating}
            className="px-3.5 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 animate-pulse"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Cooldown Expiring...' : 'Simulate 10s Cooldown Expiry -> HALF-OPEN'}</span>
          </button>
        )}

        {breakerState === 'HALF_OPEN' && (
          <>
            <button
              onClick={handleSimulateSuccess}
              className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Probe Succeeded (Close Breaker)</span>
            </button>
            <button
              onClick={handleSimulateFailure}
              className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Probe Failed (Trip back to OPEN)</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
