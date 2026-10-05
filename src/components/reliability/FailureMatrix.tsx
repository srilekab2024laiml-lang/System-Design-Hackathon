import React, { useState } from 'react';
import { AlertOctagon, ShieldCheck, Search, Filter } from 'lucide-react';
import { failureScenarios } from '../../data/reliabilityData';
import { FailureScenario } from '../../types';

export const FailureMatrix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filtered = failureScenarios.filter(f => {
    const matchesSearch = f.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.failure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.recovery.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || f.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search failure scenarios, components, recovery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Failure Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 text-[11px] uppercase">
                <th className="py-3 px-4 w-40">Component</th>
                <th className="py-3 px-4">Failure Mode</th>
                <th className="py-3 px-4 w-44">Detection Mechanism</th>
                <th className="py-3 px-4">Runtime Behavior & Recovery</th>
                <th className="py-3 px-4 w-32">Final Invariant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white align-top">
                    <div>{item.component}</div>
                    <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      item.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      item.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-200 leading-relaxed align-top">
                    {item.failure}
                  </td>
                  <td className="py-3.5 px-4 text-cyan-400 align-top text-[11px]">
                    {item.detection}
                  </td>
                  <td className="py-3.5 px-4 font-sans space-y-1 align-top text-slate-300 leading-relaxed">
                    <p><strong className="text-slate-200">Behavior:</strong> {item.behavior}</p>
                    <p className="text-emerald-400/90 font-mono text-[11px]"><strong className="text-emerald-300">Recovery:</strong> {item.recovery}</p>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 align-top font-bold text-[11px]">
                    {item.finalState}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
