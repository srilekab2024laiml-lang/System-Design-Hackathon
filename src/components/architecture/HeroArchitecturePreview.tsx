import React from 'react';
import { Users, Server, Cpu, Database, CreditCard, PackageCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface HeroArchitecturePreviewProps {
  onOpenExplorer: () => void;
}

export const HeroArchitecturePreview: React.FC<HeroArchitecturePreviewProps> = ({ onOpenExplorer }) => {
  const nodes = [
    { label: 'Users', sub: '10K Burst', icon: Users, accent: 'text-indigo-400' },
    { label: 'Gateway', sub: 'Rate Limited', icon: Server, accent: 'text-blue-400' },
    { label: 'Checkout', sub: 'Orchestrator', icon: Cpu, accent: 'text-slate-300' },
    { label: 'Inventory', sub: 'Atomic Row Lock', icon: Database, accent: 'text-emerald-400' },
    { label: 'Payment', sub: 'Idempotent', icon: CreditCard, accent: 'text-amber-400' },
    { label: 'Order', sub: 'Kafka Outbox', icon: PackageCheck, accent: 'text-purple-400' },
  ];

  return (
    <div
      onClick={onOpenExplorer}
      className="group relative cursor-pointer rounded-[14px] border border-[#23272F] bg-[#0F1115] p-5 transition-all duration-300 hover:border-[#323846] hover:bg-[#13161B]"
      title="Click to open Full Architecture Explorer"
    >
      <div className="flex items-center justify-between border-b border-[#23272F] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Live Architecture Pipeline Flow
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#9CA3AF] group-hover:text-[#F5F7FA] transition-colors">
          <span>Open Full Explorer</span>
          <ExternalLink className="w-3 h-3 text-indigo-400" />
        </div>
      </div>

      {/* Nodes Strip */}
      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {nodes.map((n, idx) => {
            const Icon = n.icon;
            return (
              <React.Fragment key={idx}>
                <div className="flex-1 rounded-[10px] border border-[#23272F] bg-[#13161B] p-3 text-center transition-all group-hover:border-[#323846]">
                  <div className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#08090B] ${n.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-mono font-bold text-[#F5F7FA]">{n.label}</div>
                  <div className="text-[10px] font-mono text-[#9CA3AF] mt-0.5">{n.sub}</div>
                </div>

                {idx < nodes.length - 1 && (
                  <div className="relative flex items-center justify-center px-1">
                    <ArrowRight className="w-3.5 h-3.5 text-[#323846]" />
                    {/* Animated Particle */}
                    <span
                      className="absolute w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]"
                      style={{
                        animation: `moveParticle 2s linear infinite ${idx * 0.3}s`
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#9CA3AF] border-t border-[#23272F]/60 pt-2.5">
        <span>Request Lifecycle: &lt;80ms atomic reservation, 5-min payment lease</span>
        <span className="text-[#10B981] font-semibold">Invariant Verified</span>
      </div>
    </div>
  );
};
