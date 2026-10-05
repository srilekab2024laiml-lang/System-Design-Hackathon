import React from 'react';
import { CreditCard, ShieldCheck, AlertTriangle, Layers, Radio } from 'lucide-react';
import { PaymentScenarios } from '../components/payment/PaymentScenarios';
import { OutboxOrderDemo } from '../components/payment/OutboxOrderDemo';

export const PaymentPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono font-bold uppercase">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Section 17 & 18: Payment Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Payment Reliability & The Transactional Outbox
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          How to safely integrate third-party payment gateways with client-supplied idempotency keys, handle banking network drops, and prevent lost orders when downstream services crash.
        </p>
      </div>

      {/* Critical Outbox Demo: "Payment succeeds but Order Service is DOWN" (Section 18) */}
      <OutboxOrderDemo />

      {/* 3 Payment Scenarios: Success, Failure, Timeout (Section 17) */}
      <PaymentScenarios />
    </div>
  );
};
