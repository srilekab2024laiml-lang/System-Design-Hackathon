import React from 'react';
import {
  Users,
  Boxes,
  ShieldCheck,
  Lock,
  ArrowRight,
  Play,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { TheInvariant } from '../components/common/TheInvariant';
import { HeroArchitecturePreview } from '../components/architecture/HeroArchitecturePreview';

interface OverviewPageProps {
  onNavigate: (pageId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section (Section 11) */}
      <section className="relative overflow-hidden rounded-[16px] border border-[#23272F] bg-[#0F1115] p-8 sm:p-12 lg:p-14 space-y-8">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#13161B] border border-[#23272F] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9CA3AF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>SYSTEM DESIGN / FLASH SALE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F5F7FA] font-sans">
            SALESTORM
          </h1>

          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#9CA3AF]">
            <span className="text-[#F5F7FA]">10,000 customers.</span>{' '}
            <span className="text-[#F5F7FA]">100 units.</span>{' '}
            <span className="text-[#10B981]">Zero overselling.</span>
          </div>

          <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed font-sans">
            An engineering architecture dashboard demonstrating how single-source atomic conditional reservations, two-phase expiring leases, and transactional outbox patterns eliminate race conditions and financial divergence under high concurrency bursts.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('architecture')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#6366F1] hover:bg-[#4F46E5] text-[#F5F7FA] font-mono text-xs font-bold transition-all shadow-sm"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('simulation')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#13161B] hover:bg-[#181C22] border border-[#23272F] text-[#F5F7FA] font-mono text-xs font-bold transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-[#10B981] text-[#10B981]" />
              <span>Run Live Simulation</span>
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 rounded-[10px] bg-[#13161B] hover:bg-[#181C22] border border-[#23272F] text-[#9CA3AF] hover:text-[#F5F7FA] font-mono text-xs font-bold transition-all"
            >
              Inventory Design
            </button>
          </div>
        </div>

        {/* Live Architecture Visual Preview with animated particles (Section 13) */}
        <HeroArchitecturePreview onOpenExplorer={() => onNavigate('architecture')} />
      </section>

      {/* Hero Metrics (Section 12) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Concurrent Requests"
          value="10K+"
          subtext="Simultaneous burst at T=0"
          icon={Users}
          variant="arch"
        />
        <MetricCard
          label="Limited Units"
          value="100"
          subtext="High-contention inventory"
          icon={Boxes}
          variant="default"
        />
        <MetricCard
          label="Overselling"
          value="0"
          subtext="Guaranteed strict invariant"
          icon={ShieldCheck}
          variant="emerald"
        />
        <MetricCard
          label="Critical Writes Protected"
          value="100%"
          subtext="Idempotent reservation & payment"
          icon={Lock}
          variant="default"
        />
      </section>

      {/* The Core System Invariant Component (Section 15) */}
      <TheInvariant />

      {/* Problem Storytelling Teaser (Section 14 preview) */}
      <section className="rounded-[14px] border border-[#23272F] bg-[#0F1115] p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-mono uppercase font-bold text-[#F59E0B]">The Problem</span>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#F5F7FA] tracking-tight">
              A flash sale turns a normal e-commerce workload into a distributed systems problem.
            </h2>
            <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
              When 10,000 customers hit Buy Now simultaneously for 100 units, standard application code breaks down. Separating reading stock from writing stock creates a race condition where multiple threads decrement simultaneously, causing negative stock balances.
            </p>
            <button
              onClick={() => onNavigate('problem')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 pt-1"
            >
              <span>Explore The Concurrency Problem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-7 rounded-[12px] border border-[#23272F] bg-[#13161B] p-6 font-mono text-xs space-y-4">
            <div className="text-[10px] uppercase font-semibold text-[#9CA3AF] border-b border-[#23272F] pb-2">
              Visual Bottleneck & Invariant Breakdown
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#08090B] border border-[#23272F]">
                <span className="text-[#9CA3AF]">Incoming Surge:</span>
                <span className="font-bold text-blue-400">10,000 Concurrent Customers</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#08090B] border border-[#23272F]">
                <span className="text-[#9CA3AF]">Physical Constraint:</span>
                <span className="font-bold text-[#F5F7FA]">100 Units Total</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#08090B] border border-[#23272F]">
                <span className="text-[#9CA3AF]">Concurrency Challenge:</span>
                <span className="font-bold text-[#F59E0B]">Atomic Evaluated Row Lock</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#10B981]/10 border border-[#10B981]/30">
                <span className="text-[#10B981] font-bold">Guaranteed Outcome:</span>
                <span className="font-bold text-[#10B981]">100 Sales, 9,900 Out-of-Stock, 0 Oversold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution: 11 Pillars of Architecture */}
      <section className="rounded-[14px] border border-[#23272F] bg-[#0F1115] p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#23272F] pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-indigo-400">Section 40: Architectural Blueprint</span>
            <h2 className="text-xl font-bold text-[#F5F7FA] mt-1 font-sans">
              THE SALESTORM END-TO-END SOLUTION (11 PILLARS)
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-[6px] text-xs font-mono font-semibold bg-[#13161B] text-[#9CA3AF] border border-[#23272F]">
            11 Core Mechanisms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {[
            { num: '01', title: 'Edge Ingress Defense', desc: 'Cloudflare WAF & Anycast CDN absorb 90%+ read traffic and filter automated scalper bots before reaching origin.' },
            { num: '02', title: 'Horizontal API Gateway', desc: 'Stateless Envoy API Gateway cluster scales with HPA, enforces JWT tokens, and regulates token-bucket rate limits.' },
            { num: '03', title: 'Authoritative Inventory State', desc: 'PostgreSQL single primary acts as the sole source of truth with CHECK (available_quantity >= 0) constraint.' },
            { num: '04', title: 'Atomic Row-Level Reservation', desc: 'Single-statement conditional UPDATE evaluates and decrements stock in microseconds under database row lock.' },
            { num: '05', title: 'Two-Phase Expiring Lease', desc: 'Customers receive a 5-minute lease (RESERVED) to pay calmly without holding expensive database row locks during 3s bank calls.' },
            { num: '06', title: 'End-to-End Idempotency', desc: 'Client Idempotency-Key headers prevent double charges and duplicate order creations across retries.' },
            { num: '07', title: 'Decoupled Payments', desc: 'Payment Service interfaces with Stripe; verification reconciler handles network timeouts safely.' },
            { num: '08', title: 'Transactional Outbox Pattern', desc: 'Payment record and Outbox event are committed in the same local ACID transaction, completely eliminating lost orders.' },
            { num: '09', title: 'Idempotent Order Creation', desc: 'Order Service consumes Kafka events and inserts orders with unique payment_id / reservation_id constraints.' },
            { num: '10', title: 'Queue Failure Isolation', desc: 'Apache Kafka buffers post-sale workloads (warehouse slips, SMS receipts) so external vendor downtime never impacts checkout.' },
            { num: '11', title: 'Full-Spectrum Observability', desc: 'OpenTelemetry tracing, Prometheus metrics, and circuit breakers ensure sub-250ms p95 latency and real-time error shedding.' }
          ].map((item) => (
            <div key={item.num} className="p-4 rounded-[12px] border border-[#23272F] bg-[#13161B] space-y-2 hover:border-[#323846] transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-[4px] bg-[#08090B] text-indigo-400 border border-[#23272F] flex items-center justify-center font-bold text-[10px]">
                  {item.num}
                </span>
                <h3 className="font-bold text-[#F5F7FA] text-xs">{item.title}</h3>
              </div>
              <p className="text-[#9CA3AF] font-sans text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
