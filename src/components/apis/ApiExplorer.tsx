import React, { useState } from 'react';
import { Code2, Key, ShieldCheck, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { apiEndpoints } from '../../data/apiData';
import { ApiEndpoint } from '../../types';
import { CodeBlock } from '../common/CodeBlock';

export const ApiExplorer: React.FC = () => {
  const groups: ('Product' | 'Reservation' | 'Payment' | 'Orders')[] = ['Reservation', 'Payment', 'Orders', 'Product'];
  const [activeGroup, setActiveGroup] = useState<'Product' | 'Reservation' | 'Payment' | 'Orders'>('Reservation');
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint>(apiEndpoints[2]); // POST /api/v1/reservations

  const filteredEndpoints = apiEndpoints.filter(a => a.group === activeGroup);

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'POST':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'DELETE':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'PUT':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Group Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => {
              setActiveGroup(group);
              const firstInGroup = apiEndpoints.find(a => a.group === group);
              if (firstInGroup) setSelectedApi(firstInGroup);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeGroup === group
                ? 'bg-cyan-950/60 border border-cyan-500 text-cyan-300 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            {group} APIs
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-4 space-y-2">
          {filteredEndpoints.map((api) => {
            const isSelected = selectedApi.id === api.id;
            return (
              <button
                key={api.id}
                onClick={() => setSelectedApi(api)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all space-y-1.5 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 text-white ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getMethodBadge(api.method)}`}>
                    {api.method}
                  </span>
                  {api.idempotencyHeaderRequired && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                      IDEMPOTENT
                    </span>
                  )}
                </div>
                <div className="font-bold truncate text-slate-200">
                  {api.path}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                  {api.summary}
                </div>
              </button>
            );
          })}
        </div>

        {/* Endpoint Detail Inspector */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${getMethodBadge(selectedApi.method)}`}>
                  {selectedApi.method}
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {selectedApi.path}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {selectedApi.summary}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">SLA Latency Target</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{selectedApi.latencyTarget}</span>
            </div>
          </div>

          {/* Idempotency & Auth Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Idempotency-Key Header:</span>
              <span className={`font-bold ${selectedApi.idempotencyHeaderRequired ? 'text-amber-400' : 'text-slate-500'}`}>
                {selectedApi.idempotencyHeaderRequired ? 'MANDATORY (UUIDv4)' : 'Optional / Safe GET'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Authentication:</span>
              <span className="font-bold text-cyan-400">Bearer JWT (RS256)</span>
            </div>
          </div>

          {/* Request payload */}
          {selectedApi.requestBody && (
            <div>
              <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">
                Request JSON Payload
              </h4>
              <CodeBlock
                language="json"
                code={selectedApi.requestBody}
                title="Application/JSON Body"
                showLineNumbers={false}
              />
            </div>
          )}

          {/* Response Payload */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">
              Response JSON Schema (200 / 201 Success)
            </h4>
            <CodeBlock
              language="json"
              code={selectedApi.responseBody}
              title="Application/JSON Response"
              showLineNumbers={false}
            />
          </div>

          {/* Status Codes & Failure Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Status Codes</span>
              <ul className="space-y-1.5">
                {selectedApi.statusCodes.map((sc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      sc.code < 300 ? 'bg-emerald-950 text-emerald-400' :
                      sc.code < 500 ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {sc.code}
                    </span>
                    <span className="text-slate-300 font-sans text-xs">{sc.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Failure Recovery Behavior</span>
              <ul className="space-y-1.5">
                {selectedApi.failureCases.map((fc, i) => (
                  <li key={i} className="text-slate-300 font-sans text-xs flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{fc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
