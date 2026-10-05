import React from 'react';
import { Network, Zap, Shield, Cpu, Database, Radio, CheckCircle2, ArrowRight } from 'lucide-react';
import { InteractiveDiagram } from '../components/architecture/InteractiveDiagram';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Network className="w-3.5 h-3.5" />
          <span>Section 9, 10 & 11: Core Engineering Model</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Distributed System Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          The end-to-end topological layout designed for 10,000 concurrent customers and 100 units. Click any node to inspect responsibilities, APIs, scaling models, and failure recovery. Click <strong>"Run Data Flow Animation"</strong> to trace an active transaction.
        </p>
      </div>

      {/* Main Interactive Diagram */}
      <InteractiveDiagram />

      {/* Architectural Tier Legend */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
          Architecture Tier Classification & SLA Boundaries
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Shield className="w-4 h-4" />
              <span>Edge & Gateway Tier</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              Cloudflare Anycast CDN, WAF, ALB, and Envoy API Gateway. Absorbs 90%+ read traffic and filters automated bots before reaching origin.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Stateless Service Tier</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              Product, Auth, Checkout, and Payment microservices. Auto-scaled horizontally via Kubernetes HPA on CPU and request latency metrics.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Database className="w-4 h-4" />
              <span>Authoritative Core</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              PostgreSQL with PgBouncer connection multiplexing and atomic row-level conditional updates. The single authoritative source of truth.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Radio className="w-4 h-4" />
              <span>Asynchronous Event Bus</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              Apache Kafka cluster and Transactional Outbox workers. Decouples post-checkout fulfillment and notification pipelines with zero lost events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
