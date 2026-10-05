import React from 'react';
import { PackageCheck, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { OrderStateMachine } from '../components/order/OrderStateMachine';

export const OrderPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase">
          <PackageCheck className="w-3.5 h-3.5" />
          <span>Section 19: Order Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Order Lifecycle & Idempotent Processing
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          The permanent, immutable legal state machine that converts captured customer payments into confirmed orders and triggers warehouse dispatch.
        </p>
      </div>

      {/* Order State Machine Visualizer */}
      <OrderStateMachine />

      {/* Idempotent Consumer Rules */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Idempotent Kafka Consumer Guarantees</span>
        </h3>
        <p className="text-slate-300 font-sans leading-relaxed">
          Because the Outbox worker uses at-least-once delivery, the Order Service may receive the same <code className="text-cyan-400">PaymentSucceeded</code> event multiple times. The Order Service enforces idempotency by querying the unique <code className="text-amber-400">payment_id</code> before executing an insert.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300">
          <code>
            INSERT INTO orders (id, payment_id, reservation_id, status) <br />
            VALUES (:orderId, :paymentId, :reservationId, 'CONFIRMED') <br />
            ON CONFLICT (payment_id) DO NOTHING;
          </code>
        </div>
      </div>
    </div>
  );
};
