import React, { useState } from 'react';
import { X, Layers, Cpu, Server, Activity, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ArchitectureComponent } from '../../types';
import { SourceBadge } from '../common/SourceBadge';

interface ComponentDrawerProps {
  component: ArchitectureComponent | null;
  onClose: () => void;
  onSelectDependency?: (depId: string) => void;
}

export const ComponentDrawer: React.FC<ComponentDrawerProps> = ({
  component,
  onClose,
  onSelectDependency,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'apis' | 'scaling' | 'failures'>('overview');

  if (!component) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0F1115] border-l border-[#23272F] shadow-2xl flex flex-col animate-fade-in no-print">
      {/* Header */}
      <div className="p-6 border-b border-[#23272F] bg-[#08090B] flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold bg-[#13161B] text-indigo-400 border border-[#23272F]">
              {component.category}
            </span>
            <SourceBadge source={component.source} />
          </div>
          <h2 className="text-lg font-bold text-[#F5F7FA] tracking-tight font-sans">
            {component.name}
          </h2>
          <p className="text-xs font-mono text-[#9CA3AF] mt-0.5">
            Tech: {component.techStack}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-[6px] text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#13161B] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#23272F] bg-[#0F1115] px-6 text-xs font-mono">
        {(['overview', 'data', 'apis', 'scaling', 'failures'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-3 capitalize font-semibold transition-all border-b-2 ${
              activeTab === tab
                ? 'border-indigo-500 text-[#F5F7FA]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on Active Tab */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-mono">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Why It Exists In Flash Sale:</span>
              <p className="text-[#F5F7FA] font-sans leading-relaxed text-xs">
                {component.whyItExists}
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Core Responsibility:</span>
              <p className="text-[#9CA3AF] font-sans leading-relaxed text-xs">
                {component.responsibility}
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#10B981] block">Status:</span>
              <div className="flex items-center gap-2 text-[#10B981] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Operational & Invariant Compliant</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">Data Owned & Managed:</span>
              <p className="text-[#F5F7FA] leading-relaxed text-xs">
                {component.dataOwned}
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#10B981] block">Consistency Boundary:</span>
              <p className="text-[#9CA3AF] font-sans text-xs">
                {component.category === 'service' && component.id === 'inventory-service'
                  ? 'Strict ACID serializability; primary master row lock evaluates condition inside storage engine.'
                  : 'Eventual consistency where safe; local ACID commit where financial.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'apis' && (
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Registered Interfaces:</span>
            {component.apis.map((api, idx) => (
              <div key={idx} className="p-3 rounded-[8px] bg-[#08090B] border border-[#23272F] text-indigo-300">
                {api}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scaling' && (
          <div className="space-y-4">
            <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-blue-400 block">Estimated Throughput Target:</span>
              <div className="text-sm font-bold text-[#F5F7FA]">{component.throughputEst}</div>
            </div>

            <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-blue-400 block">Scaling Strategy:</span>
              <p className="text-[#9CA3AF] font-sans text-xs leading-relaxed">
                {component.scalingStrategy}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'failures' && (
          <div className="space-y-4">
            <div className="p-4 rounded-[10px] bg-[#EF4444]/10 border border-[#EF4444]/30 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#EF4444] block">Failure Mode & Recovery Behavior:</span>
              <p className="text-[#F5F7FA] font-sans text-xs leading-relaxed">
                {component.failureBehavior}
              </p>
            </div>

            {component.dependencies.length > 0 && (
              <div className="p-4 rounded-[10px] bg-[#13161B] border border-[#23272F] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Downstream Dependencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {component.dependencies.map((dep, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectDependency && onSelectDependency(dep)}
                      className="px-2.5 py-1 rounded-[6px] bg-[#08090B] border border-[#23272F] text-[#9CA3AF] hover:text-[#F5F7FA] flex items-center gap-1"
                    >
                      <span>{dep}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
