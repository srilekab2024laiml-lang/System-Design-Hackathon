import React, { useState } from 'react';
import { Layers, Radio, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw, Play, ArrowRight } from 'lucide-react';
import { CodeBlock } from '../components/common/CodeBlock';

export const OutboxPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'outbox'>('outbox');
  const [outboxStep, setOutboxStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const eventsCatalog = [
    { name: 'InventoryReserved', producer: 'Inventory Service', consumer: 'Checkout Orchestrator', purpose: 'Signals that stock has been temporarily allocated.' },
    { name: 'PaymentSucceeded', producer: 'Payment Service', consumer: 'Order Service, Kafka Outbox', purpose: 'Triggers immutable order creation and receipts.' },
    { name: 'PaymentFailed', producer: 'Payment Service', consumer: 'Inventory Service', purpose: 'Triggers instant release of held reservation back to stock.' },
    { name: 'ReservationExpired', producer: 'Sweeper Daemon', consumer: 'Inventory Service', purpose: 'Rolls back 5-minute lease and increments available units.' },
    { name: 'OrderConfirmed', producer: 'Order Service', consumer: 'Shipment Svc, Notification Svc', purpose: 'Dispatches warehouse fulfillment and SMS confirmation.' },
    { name: 'ShipmentRequested', producer: 'Order Service', consumer: 'Warehouse 3PL Courier', purpose: 'Generates FedEx shipping label and tracking number.' }
  ];

  const handleSimulateOutbox = () => {
    setIsSimulating(true);
    setOutboxStep(1);
    setTimeout(() => setOutboxStep(2), 1000);
    setTimeout(() => setOutboxStep(3), 2000);
    setTimeout(() => {
      setOutboxStep(4);
      setIsSimulating(false);
    }, 3200);
  };

  const handleResetOutbox = () => {
    setOutboxStep(0);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Layers className="w-3.5 h-3.5" />
          <span>Section 24 & 25: Event Bus & Outbox Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Transactional Outbox & Event-Driven Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          How to eliminate the dual-write vulnerability between relational databases and message brokers, ensuring zero lost domain events and complete post-sale decoupling.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('outbox')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'outbox'
              ? 'bg-cyan-950/60 border border-cyan-500 text-cyan-300 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          Section 25: The Transactional Outbox Pattern
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-cyan-950/60 border border-cyan-500 text-cyan-300 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          Section 24: Domain Event Catalog & DLQ
        </button>
      </div>

      {activeTab === 'outbox' ? (
        <div className="space-y-6">
          {/* Outbox Interactive Visualizer */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-amber-400">Interactive Pipeline</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Solving the "Dual-Write" Problem
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateOutbox}
                  disabled={isSimulating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Simulate Atomic Outbox Commit</span>
                </button>
                <button
                  onClick={handleResetOutbox}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step Pipeline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className={`p-4 rounded-xl border transition-all ${
                outboxStep >= 1 ? 'border-cyan-500/60 bg-cyan-950/30' : 'border-slate-800 bg-slate-950'
              }`}>
                <div className="text-slate-500 uppercase font-bold text-[10px]">Step 1</div>
                <div className="text-sm font-bold text-white mt-1">BEGIN TRANSACTION</div>
                <p className="text-slate-400 font-sans text-xs mt-1">
                  Open local PostgreSQL ACID transaction in Payment Service.
                </p>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                outboxStep >= 2 ? 'border-cyan-500/60 bg-cyan-950/30' : 'border-slate-800 bg-slate-950'
              }`}>
                <div className="text-slate-500 uppercase font-bold text-[10px]">Step 2</div>
                <div className="text-sm font-bold text-white mt-1">MUTATE + INSERT EVENT</div>
                <p className="text-slate-400 font-sans text-xs mt-1">
                  UPDATE payments AND INSERT INTO outbox_events in SAME commit!
                </p>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                outboxStep >= 3 ? 'border-emerald-500/60 bg-emerald-950/30' : 'border-slate-800 bg-slate-950'
              }`}>
                <div className="text-slate-500 uppercase font-bold text-[10px]">Step 3</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">COMMIT TRANSACTION</div>
                <p className="text-slate-400 font-sans text-xs mt-1">
                  Atomicity guaranteed: If DB commits, event is 100% permanently on disk.
                </p>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                outboxStep >= 4 ? 'border-purple-500/60 bg-purple-950/30' : 'border-slate-800 bg-slate-950'
              }`}>
                <div className="text-slate-500 uppercase font-bold text-[10px]">Step 4</div>
                <div className="text-sm font-bold text-purple-400 mt-1">CDC / KAFKA PUBLISH</div>
                <p className="text-slate-400 font-sans text-xs mt-1">
                  Debezium streams WAL event to Kafka topic. Order Service consumes.
                </p>
              </div>
            </div>

            {outboxStep >= 4 && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Dual-write successfully avoided! Event delivered with at-least-once guarantee to Apache Kafka.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Event Catalog Table */
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] overflow-hidden">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[11px] uppercase">
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Producer</th>
                <th className="py-3 px-4">Consumer(s)</th>
                <th className="py-3 px-4">Business Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {eventsCatalog.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50">
                  <td className="py-3 px-4 font-bold text-cyan-300">{evt.name}</td>
                  <td className="py-3 px-4 text-white">{evt.producer}</td>
                  <td className="py-3 px-4 text-purple-400">{evt.consumer}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">{evt.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
