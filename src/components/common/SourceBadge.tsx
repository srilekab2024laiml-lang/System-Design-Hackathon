import React from 'react';
import { SourceType } from '../../types';

interface SourceBadgeProps {
  source: SourceType;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className = '' }) => {
  switch (source) {
    case 'brief':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-medium tracking-wide bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 ${className}`}>
          ● From Hackathon Brief
        </span>
      );
    case 'decision':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-medium tracking-wide bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 ${className}`}>
          ◆ Architecture Decision
        </span>
      );
    case 'assumption':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-medium tracking-wide bg-amber-950/80 text-amber-400 border border-amber-800/80 ${className}`}>
          ▲ Assumption
        </span>
      );
    case 'simulation':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-medium tracking-wide bg-purple-950/80 text-purple-400 border border-purple-800/80 ${className}`}>
          ⚡ Simulation
        </span>
      );
    default:
      return null;
  }
};
