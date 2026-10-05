import React, { useState } from 'react';
import { PackageCheck, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OrderStateInfo {
  state: string;
  category: 'progress' | 'complete' | 'failure';
  description: string;
  allowedNext: string[];
  databaseTrigger: string;
}

export const OrderStateMachine: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('CONFIRMED');

  const states: Record<string, OrderStateInfo> = {
    CREATED: {
      state: 'CREATED',
      category: 'progress',
      description: 'Order draft entity generated from checkout payload with unique order_id and idempotency_key.',
      allowedNext: ['PAYMENT_PENDING', 'CANCELLED'],
      databaseTrigger: 'INSERT INTO orders (id, user_id, status) VALUES (:id, :userId, \'CREATED\');'
    },
    PAYMENT_PENDING: {
      state: 'PAYMENT_PENDING',
      category: 'progress',
      description: 'Waiting for synchronous banking capture or asynchronous Stripe webhook confirmation.',
      allowedNext: ['PAID', 'PAYMENT_FAILED'],
      databaseTrigger: 'UPDATE orders SET status = \'PAYMENT_PENDING\' WHERE id = :id;'
    },
    PAID: {
      state: 'PAID',
      category: 'progress',
      description: 'Payment verified and settled in database. Transactional Outbox event staged.',
      allowedNext: ['CONFIRMED', 'REFUNDED'],
      databaseTrigger: 'UPDATE orders SET payment_id = :payId, status = \'PAID\' WHERE id = :id;'
    },
    CONFIRMED: {
      state: 'CONFIRMED',
      category: 'progress',
      description: 'Customer notified with official order confirmation. Inventory permanently marked as SOLD.',
      allowedNext: ['PROCESSING', 'CANCELLED'],
      databaseTrigger: 'UPDATE inventory SET reserved_quantity = reserved - 1, sold_quantity = sold + 1;'
    },
    PROCESSING: {
      state: 'PROCESSING',
      category: 'progress',
      description: 'Warehouse ERP picking and packing physical goods in fulfillment bin.',
      allowedNext: ['SHIPPED'],
      databaseTrigger: 'UPDATE orders SET status = \'PROCESSING\' WHERE id = :id;'
    },
    SHIPPED: {
      state: 'SHIPPED',
      category: 'complete',
      description: 'Handed off to 3PL courier (FedEx/UPS) with generated tracking number.',
      allowedNext: ['DELIVERED'],
      databaseTrigger: 'INSERT INTO shipments (order_id, carrier, tracking_number, status) VALUES (...);'
    },
    DELIVERED: {
      state: 'DELIVERED',
      category: 'complete',
      description: 'Courier confirms physical handoff at customer doorstep. Final terminal state.',
      allowedNext: ['REFUNDED'],
      databaseTrigger: 'UPDATE orders SET status = \'DELIVERED\' WHERE id = :id;'
    },
    PAYMENT_FAILED: {
      state: 'PAYMENT_FAILED',
      category: 'failure',
      description: 'Card declined or payment expired. Triggers immediate reservation lease rollback.',
      allowedNext: ['CANCELLED'],
      databaseTrigger: 'UPDATE reservations SET status = \'RELEASED\' WHERE id = :resId;'
    },
    CANCELLED: {
      state: 'CANCELLED',
      category: 'failure',
      description: 'Order voided prior to shipment dispatch. Inventory returned if not yet fulfilled.',
      allowedNext: [],
      databaseTrigger: 'UPDATE orders SET status = \'CANCELLED\' WHERE id = :id;'
    },
    REFUNDED: {
      state: 'REFUNDED',
      category: 'failure',
      description: 'Funds returned to customer payment card via Stripe refund API.',
      allowedNext: [],
      databaseTrigger: 'UPDATE payments SET status = \'REFUNDED\' WHERE id = :payId;'
    }
  };

  const current = states[selectedState];

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Section 19: Order Lifecycle</span>
        <h3 className="text-base font-bold text-white mt-1">
          Interactive Order State Machine
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Click any state badge to inspect transition rules, allowed destinations, and database triggers.
        </p>
      </div>

      {/* Main Order Pipeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-[850px]">
          {['CREATED', 'PAYMENT_PENDING', 'PAID', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((stKey, idx, arr) => {
            const isSelected = selectedState === stKey;
            const isDelivered = stKey === 'DELIVERED';
            return (
              <React.Fragment key={stKey}>
                <button
                  onClick={() => setSelectedState(stKey)}
                  className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/50 ring-2 ring-cyan-500/20'
                      : isDelivered
                      ? 'border-emerald-600/40 bg-emerald-950/20 hover:border-emerald-500'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-500 uppercase">State {idx + 1}</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${isSelected ? 'text-cyan-400' : isDelivered ? 'text-emerald-400' : 'text-white'}`}>
                    {stKey}
                  </div>
                </button>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Exceptional / Failure states */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="text-[11px] font-mono text-rose-400/80 mb-2 font-semibold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Exceptional / Compensation States</span>
        </div>
        <div className="flex gap-3">
          {['PAYMENT_FAILED', 'CANCELLED', 'REFUNDED'].map((stKey) => {
            const isSelected = selectedState === stKey;
            return (
              <button
                key={stKey}
                onClick={() => setSelectedState(stKey)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'border-rose-400 bg-rose-950/50 text-rose-300 ring-2 ring-rose-500/20'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white'
                }`}
              >
                {stKey}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected State Details */}
      {current && (
        <div className="p-5 rounded-xl border border-slate-700 bg-slate-900/80 space-y-3 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{current.state}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                current.category === 'complete' ? 'bg-emerald-950 text-emerald-400' :
                current.category === 'failure' ? 'bg-rose-950 text-rose-400' :
                'bg-cyan-950 text-cyan-400'
              }`}>
                {current.category}
              </span>
            </div>
            <div className="text-slate-400">
              Allowed Next: <strong className="text-white">{current.allowedNext.join(', ') || 'None (Terminal)'}</strong>
            </div>
          </div>

          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            {current.description}
          </p>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-300">
            <span className="text-slate-500 block mb-1">SQL / System Mutation:</span>
            <code>{current.databaseTrigger}</code>
          </div>
        </div>
      )}
    </div>
  );
};
