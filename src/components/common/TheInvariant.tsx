import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const TheInvariant: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-[14px] border border-[#23272F] bg-[#0F1115] p-6 lg:p-8 ${className}`}>
      {/* Subtle top indicator line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-80" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[6px] bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[11px] font-mono font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>CORE SYSTEM INVARIANT</span>
          </div>
          
          <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#F5F7FA]">
            Successful Sales &le; Available Inventory
          </div>
          
          <p className="text-xs text-[#9CA3AF] max-w-xl font-sans leading-relaxed">
            The foundational non-negotiable architectural property: under any level of concurrency (up to 10,000+ simultaneous requests), the count of successful confirmed sales must never exceed initial physical stock.
          </p>
        </div>

        {/* Prominent Zero Overselling Indicator */}
        <div className="flex items-center gap-4 self-start md:self-center shrink-0">
          <div className="rounded-[10px] border border-[#23272F] bg-[#13161B] p-4 text-center min-w-[140px]">
            <div className="text-[10px] font-mono uppercase font-semibold text-[#9CA3AF]">
              Allowed Overselling
            </div>
            <div className="text-4xl font-extrabold font-mono text-[#10B981] mt-1 tracking-tight">
              0
            </div>
            <div className="text-[10px] font-mono text-[#10B981] font-semibold flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Strict Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
