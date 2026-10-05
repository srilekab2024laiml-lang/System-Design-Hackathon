import React from 'react';
import { Clock, ShieldCheck, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { StateMachine } from '../components/reservation/StateMachine';
import { TimerDemo } from '../components/reservation/TimerDemo';

export const ReservationPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono font-bold uppercase">
          <Clock className="w-3.5 h-3.5" />
          <span>Section 15 & 16: Two-Phase Lease Pattern</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Reservation Lifecycle & Auto-Release Engine
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          How temporary 5-minute leases prevent database connection pool starvation during slow payment entries while guaranteeing that abandoned stock automatically returns to waiting customers.
        </p>
      </div>

      {/* Live Countdown Expiry Demo (Section 16) */}
      <TimerDemo />

      {/* Reservation State Machine Deep Dive (Section 15) */}
      <StateMachine />
    </div>
  );
};
