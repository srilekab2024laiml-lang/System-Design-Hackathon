import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  variant?: 'arch' | 'emerald' | 'amber' | 'rose' | 'default';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'arch':
        return 'border-[#23272F] bg-[#13161B] text-indigo-400';
      case 'emerald':
        return 'border-[#10B981]/30 bg-[#0F1115] text-[#10B981]';
      case 'amber':
        return 'border-[#F59E0B]/30 bg-[#0F1115] text-[#F59E0B]';
      case 'rose':
        return 'border-[#EF4444]/30 bg-[#0F1115] text-[#EF4444]';
      default:
        return 'border-[#23272F] bg-[#0F1115] text-[#9CA3AF]';
    }
  };

  return (
    <div className={`group relative rounded-[14px] border p-5 transition-all duration-200 hover:border-[#323846] ${getVariantStyles()} ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#9CA3AF] font-mono">
          {label}
        </span>
        {Icon && (
          <div className="p-2 rounded-[8px] bg-[#08090B] border border-[#23272F] text-[#F5F7FA]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold font-mono tracking-tight text-[#F5F7FA] tabular-nums">
          {value}
        </span>
      </div>
      {subtext && (
        <p className="mt-1.5 text-xs text-[#9CA3AF] font-sans">
          {subtext}
        </p>
      )}
    </div>
  );
};
