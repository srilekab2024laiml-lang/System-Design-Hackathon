import React from 'react';
import { Code2, ShieldCheck, Key, Server } from 'lucide-react';
import { ApiExplorer } from '../components/apis/ApiExplorer';

export const ApiPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Code2 className="w-3.5 h-3.5" />
          <span>Section 22: Contract Definitions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          API Explorer & Interface Specifications
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          OpenAPI 3.1 style documentation for all reservation, payment, order, and catalog endpoints, complete with request headers, idempotency requirements, and error payloads.
        </p>
      </div>

      {/* Main Api Explorer */}
      <ApiExplorer />
    </div>
  );
};
