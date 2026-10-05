import React, { useState } from 'react';
import { CreditCard, Server, Radio, PackageCheck, AlertTriangle, CheckCircle2, RotateCcw, Play } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

export const OutboxOrderDemo: React.FC = () => {
  const [isOrderServiceDown, setIsOrderServiceDown] = useState<boolean>(true);
  const [stage, setStage] = useState<'idle' | 'payment_captured' | 'buffered_in_kafka' | 'recovered_and_created'>('idle');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const outboxSql = `-- PAYMENT SERVICE ATOMIC LOCAL TRANSACTION
BEGIN TRANSACTION;
  -- 1. Update financial payment status
  UPDATE payments 
  SET status = 'SUCCEEDED', gateway_ref = 'ch_3N8cABC9921' 
  WHERE id = 'pay-9921';

  -- 2. Stage Outbox event in the EXACT SAME local commit
  INSERT INTO outbox_events (
    aggregate_type, aggregate_id, event_type, payload, status
  ) VALUES (
    'PAYMENT', 'pay-9921', 'PaymentSucceeded', 
    '{"reservationId": "res-001", "userId": "usr-1021", "amount": 19900}', 
    'PENDING'
  );
COMMIT;
-- Even if Order Service is down, the event is permanently written to PostgreSQL disk!`;

  const handleRunDemo = () => {
    setIsProcessing(true);
    setStage('payment_captured');

    setTimeout(() => {
      setStage('buffered_in_kafka');
      setIsProcessing(false);
    }, 1200);
  };

  const handleRecoverService = () => {
    setIsProcessing(true);
    setIsOrderServiceDown(false);

    setTimeout(() => {
      setStage('recovered_and_created');
      setIsProcessing(false);
    }, 1500);
  };

  const handleReset = () => {
    setIsOrderServiceDown(true);
    setStage('idle');
    setIsProcessing(false);
  };

  return (
    <div className="p-6 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23272F] pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase text-amber-400">
            Section 28: Centerpiece Presentation Moment
          </span>
          <h3 className="text-base font-bold text-[#F5F7FA] font-sans mt-0.5">
            What if Payment Succeeds but Order Service Fails?
          </h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5 font-sans">
            Demonstrating how the Transactional Outbox pattern guarantees zero lost orders during cascading downstream outages.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#13161B] hover:bg-[#181C22] border border-[#23272F] text-xs font-mono text-[#F5F7FA] transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleRunDemo}
          disabled={stage !== 'idle' || isProcessing}
          className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Simulate Payment while Order Service is DOWN</span>
        </button>

        {stage === 'buffered_in_kafka' && (
          <button
            onClick={handleRecoverService}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#10B981] hover:bg-[#059669] text-white font-mono text-xs font-bold transition-all shadow-sm animate-pulse"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Recover Order Service & Drain Kafka Queue</span>
          </button>
        )}
      </div>

      {/* Visual Pipeline Nodes with explicit Section 28 status indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        {/* Node 1: Payment Success */}
        <div className={`p-4 rounded-[12px] border transition-all ${
          stage !== 'idle' ? 'border-[#10B981]/40 bg-[#10B981]/10' : 'border-[#23272F] bg-[#13161B]'
        }`}>
          <div className="text-[10px] text-[#6B7280] uppercase font-bold">1. Payment</div>
          <div className="text-xs font-bold text-[#F5F7FA] mt-1">PAYMENT SUCCESS</div>
          <p className="text-[#9CA3AF] text-[11px] font-sans mt-1">
            {stage === 'idle' ? 'Awaiting charge' : '$199.00 captured by Stripe.'}
          </p>
        </div>

        {/* Node 2: Database Commit */}
        <div className={`p-4 rounded-[12px] border transition-all ${
          stage !== 'idle' ? 'border-[#10B981]/40 bg-[#10B981]/10' : 'border-[#23272F] bg-[#13161B]'
        }`}>
          <div className="text-[10px] text-[#6B7280] uppercase font-bold">2. Local ACID DB</div>
          <div className="text-xs font-bold text-[#F5F7FA] mt-1">DATABASE COMMIT</div>
          <p className="text-[#9CA3AF] text-[11px] font-sans mt-1">
            Payment record committed in PostgreSQL.
          </p>
        </div>

        {/* Node 3: Outbox Event */}
        <div className={`p-4 rounded-[12px] border transition-all ${
          stage !== 'idle' ? 'border-indigo-500/40 bg-indigo-950/20' : 'border-[#23272F] bg-[#13161B]'
        }`}>
          <div className="text-[10px] text-[#6B7280] uppercase font-bold">3. Outbox Table</div>
          <div className="text-xs font-bold text-[#F5F7FA] mt-1">OUTBOX EVENT</div>
          <p className="text-[#9CA3AF] text-[11px] font-sans mt-1">
            PaymentSucceeded staged in same transaction.
          </p>
        </div>

        {/* Node 4: Message Broker */}
        <div className={`p-4 rounded-[12px] border transition-all ${
          stage === 'buffered_in_kafka' || stage === 'recovered_and_created' ? 'border-purple-500/40 bg-purple-950/20' : 'border-[#23272F] bg-[#13161B]'
        }`}>
          <div className="text-[10px] text-[#6B7280] uppercase font-bold">4. Event Bus</div>
          <div className="text-xs font-bold text-[#F5F7FA] mt-1">MESSAGE BROKER</div>
          <p className="text-[#9CA3AF] text-[11px] font-sans mt-1">
            {stage === 'buffered_in_kafka' ? '1 message retained on disk' : 'Topic: payment.succeeded'}
          </p>
        </div>

        {/* Node 5: Order Service with explicit Section 28 status indicators */}
        <div className={`p-4 rounded-[12px] border transition-all ${
          isOrderServiceDown
            ? 'border-[#EF4444]/60 bg-[#EF4444]/10'
            : stage === 'recovered_and_created'
            ? 'border-[#10B981]/50 bg-[#10B981]/15'
            : 'border-[#23272F] bg-[#13161B]'
        }`}>
          <div className="text-[10px] text-[#6B7280] uppercase font-bold">5. Order Service</div>
          <div className="text-xs font-bold text-[#F5F7FA] mt-1">
            {isOrderServiceDown ? 'ORDER SERVICE OFFLINE' : 'ORDER SERVICE ONLINE'}
          </div>
          
          {/* Explicit status indicators from Section 28 */}
          <div className="mt-2 flex items-center gap-1.5 font-bold text-[11px]">
            {isOrderServiceDown ? (
              <span className="text-[#EF4444] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                ● Order Service — DOWN
              </span>
            ) : (
              <span className="text-[#10B981] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                ● Order Service — HEALTHY
              </span>
            )}
          </div>

          {stage === 'recovered_and_created' && (
            <div className="mt-2 text-[10px] text-[#10B981] font-bold">
              &rarr; ORDER ORD-9921 CREATED
            </div>
          )}
        </div>
      </div>

      {/* Explanatory Narrative Box */}
      {stage === 'buffered_in_kafka' && (
        <div className="p-4 rounded-[10px] border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-xs font-mono text-[#F5F7FA] space-y-1">
          <div className="text-[#F59E0B] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>DOWNSTREAM FAILURE SAFELY BUFFERED WITHOUT DATA LOSS</span>
          </div>
          <p className="text-[#9CA3AF] font-sans">
            The customer was charged $199.00. The Order Service is currently <strong className="text-[#EF4444]">DOWN</strong>. 
            Because of the Transactional Outbox, the event is saved on Kafka disk. When the service recovers, zero orders will be lost.
          </p>
        </div>
      )}

      {stage === 'recovered_and_created' && (
        <div className="p-4 rounded-[10px] border border-[#10B981]/30 bg-[#10B981]/10 text-xs font-mono text-[#10B981] space-y-1 animate-fade-in">
          <div className="font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>EVENT CONSUMED &bull; ORDER CREATED (ZERO LOST REVENUE)</span>
          </div>
          <p className="text-[#9CA3AF] font-sans">
            Order Service reported healthy. The Kafka consumer group consumed the uncommitted offset and inserted order <strong>ORD-9921</strong>.
          </p>
        </div>
      )}

      <CodeBlock
        title="Transactional Outbox SQL Atomic Pattern"
        language="sql"
        code={outboxSql}
      />
    </div>
  );
};
