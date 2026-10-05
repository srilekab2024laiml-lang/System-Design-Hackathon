import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertOctagon, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';

interface StateDetail {
  state: string;
  label: string;
  category: 'active' | 'success' | 'failure';
  meaning: string;
  databaseState: string;
  allowedTransitions: string[];
  timeout: string;
  recovery: string;
}

export const StateMachine: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('RESERVED');

  const states: Record<string, StateDetail> = {
    AVAILABLE: {
      state: 'AVAILABLE',
      label: 'Available in Inventory',
      category: 'active',
      meaning: 'Physical stock is unallocated and ready to be claimed by competing customers.',
      databaseState: 'inventory.available_quantity > 0. reservations table has no active lock for this unit.',
      allowedTransitions: ['RESERVED'],
      timeout: 'None (sale duration until sold out)',
      recovery: 'N/A'
    },
    RESERVED: {
      state: 'RESERVED',
      label: 'Temporarily Held',
      category: 'active',
      meaning: 'Atomic reservation granted to a specific customer session via conditional UPDATE. 5-minute lease clock starts.',
      databaseState: 'reservations.status = "RESERVED", inventory.available_quantity - 1, inventory.reserved_quantity + 1.',
      allowedTransitions: ['PAYMENT_PENDING', 'EXPIRED', 'RELEASED'],
      timeout: '300 seconds (5 minutes)',
      recovery: 'If abandoned, auto-transition to EXPIRED.'
    },
    PAYMENT_PENDING: {
      state: 'PAYMENT_PENDING',
      label: 'Payment in Progress',
      category: 'active',
      meaning: 'Customer has submitted card details to external payment processor (Stripe/Adyen). Waiting for bank ACK.',
      databaseState: 'reservations.status = "PAYMENT_PENDING", payments.status = "INITIATED".',
      allowedTransitions: ['CONFIRMED', 'EXPIRED', 'FAILED'],
      timeout: '30 seconds gateway processing window',
      recovery: 'Network timeout triggers query-status check before deciding to confirm or release.'
    },
    CONFIRMED: {
      state: 'CONFIRMED',
      label: 'Payment Confirmed',
      category: 'success',
      meaning: 'External payment processor successfully captured funds. Transactional Outbox event staged.',
      databaseState: 'payments.status = "SUCCEEDED", reservations.status = "CONFIRMED".',
      allowedTransitions: ['SOLD'],
      timeout: 'Instantaneous transition',
      recovery: 'Outbox CDC ensures Order record creation even if Order Service is temporarily down.'
    },
    SOLD: {
      state: 'SOLD',
      label: 'Order Finalized & Sold',
      category: 'success',
      meaning: 'Legal order record ORD-XXXX created. Stock permanently converted from reserved to sold.',
      databaseState: 'inventory.reserved_quantity - 1, inventory.sold_quantity + 1, orders.status = "CONFIRMED".',
      allowedTransitions: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
      timeout: 'Terminal state (Permanent)',
      recovery: 'Fulfilled via asynchronous warehouse dispatch.'
    },
    EXPIRED: {
      state: 'EXPIRED',
      label: 'Reservation Timed Out',
      category: 'failure',
      meaning: 'Customer did not complete payment within the 300s lease window. Holding lock forfeited.',
      databaseState: 'reservations.status = "EXPIRED".',
      allowedTransitions: ['RELEASED'],
      timeout: 'Immediate sweeper trigger',
      recovery: 'Triggers atomic database inventory rollback.'
    },
    RELEASED: {
      state: 'RELEASED',
      label: 'Inventory Returned to Pool',
      category: 'failure',
      meaning: 'Held stock has been returned to available inventory pool, giving waiting customers another chance.',
      databaseState: 'UPDATE inventory SET available = available + 1, reserved = reserved - 1. reservations.status = "RELEASED".',
      allowedTransitions: ['AVAILABLE'],
      timeout: 'Instantaneous',
      recovery: 'Next incoming Buy Now request can claim the newly available unit.'
    }
  };

  const current = states[selectedState];

  return (
    <div className="space-y-6">
      {/* Visual State Flowchart */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-x-auto">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-400 mb-4 tracking-wider">
          Reservation Lifecycle Flow (Click any state to inspect database rules)
        </h3>

        {/* Primary Success Path */}
        <div className="flex items-center gap-2 min-w-[700px] mb-6">
          {['AVAILABLE', 'RESERVED', 'PAYMENT_PENDING', 'CONFIRMED', 'SOLD'].map((stKey, idx, arr) => {
            const isSelected = selectedState === stKey;
            const isFinal = stKey === 'SOLD';
            return (
              <React.Fragment key={stKey}>
                <button
                  onClick={() => setSelectedState(stKey)}
                  className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/20'
                      : isFinal
                      ? 'border-emerald-600/40 bg-emerald-950/20 hover:border-emerald-500'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Phase {idx + 1}</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${isSelected ? 'text-cyan-400' : isFinal ? 'text-emerald-400' : 'text-white'}`}>
                    {stKey}
                  </div>
                </button>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Failure / Abandonment Path */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-rose-400/80 mb-2 flex items-center gap-1.5 font-semibold">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Abandonment / Timeout Rollback Circuit</span>
          </div>
          <div className="flex items-center gap-2 min-w-[700px]">
            <div className="text-xs font-mono text-slate-500 w-36 shrink-0">
              PAYMENT_PENDING &rarr;
            </div>
            {['EXPIRED', 'RELEASED', 'AVAILABLE'].map((stKey, idx, arr) => {
              const isSelected = selectedState === stKey;
              return (
                <React.Fragment key={stKey}>
                  <button
                    onClick={() => setSelectedState(stKey)}
                    className={`flex-1 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-rose-400 bg-rose-950/40 ring-2 ring-rose-500/20'
                        : 'border-slate-800 bg-slate-900/40 hover:border-rose-800/50'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500">Rollback Step {idx + 1}</div>
                    <div className={`text-xs font-mono font-bold mt-0.5 ${isSelected ? 'text-rose-400' : 'text-slate-300'}`}>
                      {stKey}
                    </div>
                  </button>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected State Deep Dive Panel */}
      {current && (
        <div className="p-6 rounded-2xl border border-slate-700 bg-slate-900/80 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                STATE: {current.state}
              </span>
              <h4 className="text-sm font-bold text-white">
                {current.label}
              </h4>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>TTL Lease: <strong className="text-white">{current.timeout}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-slate-400 uppercase font-semibold mb-1">State Meaning & Business Rule</div>
              <p className="text-slate-200 leading-relaxed font-sans">{current.meaning}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-emerald-400 uppercase font-semibold mb-1">Database Row Mutation</div>
              <p className="text-slate-300 leading-relaxed">{current.databaseState}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-cyan-400 uppercase font-semibold mb-1">Allowed Outbound Transitions</div>
              <div className="flex gap-2 flex-wrap mt-1">
                {current.allowedTransitions.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    &rarr; {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-amber-400 uppercase font-semibold mb-1">Failure & Expiration Recovery</div>
              <p className="text-slate-300 leading-relaxed font-sans">{current.recovery}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
