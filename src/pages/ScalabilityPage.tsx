import React, { useState } from 'react';
import { Layers, Cpu, Database, Radio, Shield, ArrowRight, Zap, Activity } from 'lucide-react';

export const ScalabilityPage: React.FC = () => {
  const [trafficScale, setTrafficScale] = useState<number>(10); // 10k, 50k, 100k, 500k

  const getScaleTier = (scale: number) => {
    if (scale <= 10) {
      return {
        label: '10,000 Customers (Hackathon Baseline)',
        apiPods: 4,
        ingressRps: '10,000 req/s',
        dbPoolConnections: 50,
        kafkaPartitions: 6,
        redisReplicas: 3,
        bottleneck: 'Single product row-lock in PostgreSQL (<20us lock hold)',
        mitigation: 'PgBouncer transaction pooling + Redis read barrier'
      };
    } else if (scale <= 50) {
      return {
        label: '50,000 Customers (Surge Spike)',
        apiPods: 16,
        ingressRps: '48,000 req/s',
        dbPoolConnections: 80,
        kafkaPartitions: 12,
        redisReplicas: 6,
        bottleneck: 'API Gateway CPU saturation from TLS termination',
        mitigation: 'Cloudflare Turnstile token verification + Envoy horizontal pod autoscaler'
      };
    } else if (scale <= 100) {
      return {
        label: '100,000 Customers (Mega Flash Drop)',
        apiPods: 32,
        ingressRps: '95,000 req/s',
        dbPoolConnections: 120,
        kafkaPartitions: 24,
        redisReplicas: 12,
        bottleneck: 'Database connection socket overhead',
        mitigation: 'Redis stock barrier short-circuits 99% of requests at gateway in <10ms'
      };
    } else {
      return {
        label: '500,000 Customers (Extreme Crowd)',
        apiPods: 64,
        ingressRps: '450,000 req/s',
        dbPoolConnections: 200,
        kafkaPartitions: 48,
        redisReplicas: 24,
        bottleneck: 'Origin network bandwidth exhaustion',
        mitigation: 'Cloudflare Virtual Waiting Room admits only 2,000 req/s to origin'
      };
    }
  };

  const currentTier = getScaleTier(trafficScale);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Layers className="w-3.5 h-3.5" />
          <span>Section 26: Architectural Simulation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Traffic Scalability & Backpressure Model
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          How the system topology scales dynamically from 10,000 to 500,000 concurrent customers using multi-tier shedding, connection pooling, and virtual waiting rooms.
        </p>
      </div>

      {/* Traffic Slider Controls */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">Interactive Load Slider</span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Simulated Traffic Load: <span className="text-cyan-300 font-mono">{trafficScale.toLocaleString()}K Customers</span>
            </h3>
          </div>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            ARCHITECTURAL SIMULATION
          </span>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={trafficScale}
            onChange={(e) => setTrafficScale(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-xs font-mono text-slate-500">
            <span>10K Baseline</span>
            <span>50K Surge</span>
            <span>100K Mega</span>
            <span>500K Extreme</span>
          </div>
        </div>

        {/* Dynamic Topology Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">API Gateway Pods</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{currentTier.apiPods} Pods</div>
            <span className="text-[10px] text-slate-500">K8s HPA Autoscaled</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">PgBouncer Sockets</span>
            <div className="text-2xl font-bold text-white mt-1">{currentTier.dbPoolConnections} Pool Size</div>
            <span className="text-[10px] text-emerald-400">Zero Socket Starvation</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Redis Read Replicas</span>
            <div className="text-2xl font-bold text-white mt-1">{currentTier.redisReplicas} Nodes</div>
            <span className="text-[10px] text-slate-500">Multi-AZ Read Cluster</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Kafka Partitions</span>
            <div className="text-2xl font-bold text-purple-400 mt-1">{currentTier.kafkaPartitions} Partitions</div>
            <span className="text-[10px] text-purple-400">High Write Fanout</span>
          </div>
        </div>

        {/* Bottleneck Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 space-y-1">
            <span className="text-rose-400 font-bold uppercase text-[10px] block">Primary Contention Point at this scale:</span>
            <p className="text-slate-200 font-sans">{currentTier.bottleneck}</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-1">
            <span className="text-emerald-400 font-bold uppercase text-[10px] block">Architectural Defense Applied:</span>
            <p className="text-slate-200 font-sans">{currentTier.mitigation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
