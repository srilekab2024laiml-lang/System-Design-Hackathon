import React from 'react';
import { Database, ShieldCheck, Key, Layers } from 'lucide-react';
import { ERDiagram } from '../components/database/ERDiagram';

export const DatabasePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Database className="w-3.5 h-3.5" />
          <span>Section 20 & 21: Persistence Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Relational Database ER Design & Invariants
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          The 12 normalized PostgreSQL entities, check constraints, foreign keys, and unique indexes that enforce ACID consistency and financial auditability across the flash sale.
        </p>
      </div>

      {/* Main ER Diagram & Table Inspector */}
      <ERDiagram />
    </div>
  );
};
