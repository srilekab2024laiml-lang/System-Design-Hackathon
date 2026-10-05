import React, { useState } from 'react';
import { Database, Key, ShieldCheck, Hash, Layers, CheckCircle2 } from 'lucide-react';
import { databaseTables } from '../../data/databaseData';
import { DatabaseTable } from '../../types';

export const ERDiagram: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<DatabaseTable>(databaseTables[0]);

  return (
    <div className="space-y-6">
      {/* Prominent Section 21: Authoritative Inventory Design Callout */}
      <div className="p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-[#071318] space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>Section 21: Authoritative Inventory Storage Design</span>
        </div>
        <h3 className="text-lg font-bold text-white">
          PostgreSQL Row-Locking Schema with Strict Balance Constraints
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          The authoritative inventory balance lives in the consistency-controlled PostgreSQL primary database. 
          By enforcing <code className="text-emerald-400 font-mono">CHECK (available_quantity &gt;= 0)</code> and 
          <code className="text-emerald-400 font-mono">CHECK (available + reserved + sold = total)</code> at the database engine level, 
          the system makes negative stock mathematically impossible even if application code were to contain a logic defect.
        </p>
      </div>

      {/* Main Table Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table Selector Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-400 px-2 tracking-wider">
            Entities ({databaseTables.length} Tables)
          </h4>
          <div className="space-y-1">
            {databaseTables.map((table) => {
              const isSelected = selectedTable.name === table.name;
              const isCore = ['inventory', 'reservations', 'payments', 'orders', 'outbox_events', 'idempotency_records'].includes(table.name);

              return (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border border-cyan-500 text-cyan-300 font-bold shadow'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Database className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{table.name}</span>
                  </div>
                  {isCore && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold shrink-0">
                      CORE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Schema Viewer */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-mono text-white">
                  TABLE: {selectedTable.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedTable.purpose}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {selectedTable.columns.length} Columns
            </div>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                  <th className="py-2.5 px-3">Column</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Modifiers</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {selectedTable.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                      {col.isPk && <span title="Primary Key"><Key className="w-3.5 h-3.5 text-amber-400 shrink-0" /></span>}
                      {col.isFk && <span title="Foreign Key"><Hash className="w-3.5 h-3.5 text-cyan-400 shrink-0" /></span>}
                      <span>{col.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300">
                      {col.type}
                    </td>
                    <td className="py-2.5 px-3 space-x-1">
                      {col.isPk && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800">PK</span>}
                      {col.isFk && <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800">FK &rarr; {col.fkRef}</span>}
                      {col.isUnique && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-950 text-purple-400 border border-purple-800">UNIQUE</span>}
                      {!col.nullable && <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">NOT NULL</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans text-xs">
                      {col.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Critical Invariant Callout */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-xs font-mono space-y-1">
            <span className="text-cyan-400 font-bold uppercase block text-[10px]">
              Critical Table Invariant:
            </span>
            <p className="text-slate-200">
              {selectedTable.criticalInvariant}
            </p>
          </div>

          {/* Indexes & Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Indexes</span>
              <ul className="space-y-1">
                {selectedTable.indexes.map((idx, i) => (
                  <li key={i} className="text-slate-300 text-[11px] leading-relaxed">
                    • {idx}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Check & Foreign Constraints</span>
              {selectedTable.constraints.length > 0 ? (
                <ul className="space-y-1">
                  {selectedTable.constraints.map((c, i) => (
                    <li key={i} className="text-emerald-400 text-[11px] leading-relaxed">
                      • {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-500 italic text-[11px]">No custom constraints defined</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
