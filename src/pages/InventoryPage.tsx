import React, { useState } from 'react';
import { Boxes, ShieldCheck, Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GuaranteeCard } from '../components/inventory/GuaranteeCard';
import { ConcurrencyDemo } from '../components/inventory/ConcurrencyDemo';

export const InventoryPage: React.FC = () => {
  const [totalStock] = useState<number>(100);
  const [availableStock, setAvailableStock] = useState<number>(100);
  const [reservedStock, setReservedStock] = useState<number>(0);
  const [soldStock, setSoldStock] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSimulateDepletion = () => {
    setIsSimulating(true);
    // Simulate step by step inventory allocation
    setAvailableStock(70);
    setReservedStock(30);
    setSoldStock(0);

    setTimeout(() => {
      setAvailableStock(30);
      setReservedStock(50);
      setSoldStock(20);
    }, 1000);

    setTimeout(() => {
      setAvailableStock(0);
      setReservedStock(30);
      setSoldStock(70);
    }, 2000);

    setTimeout(() => {
      setAvailableStock(0);
      setReservedStock(0);
      setSoldStock(100);
      setIsSimulating(false);
    }, 3200);
  };

  const handleReset = () => {
    setAvailableStock(100);
    setReservedStock(0);
    setSoldStock(0);
    setIsSimulating(false);
  };

  // Percentage calculations for horizontal inventory bar
  const availPct = (availableStock / totalStock) * 100;
  const resPct = (reservedStock / totalStock) * 100;
  const soldPct = (soldStock / totalStock) * 100;

  return (
    <div className="space-y-8">
      {/* Header (Section 21) */}
      <div className="space-y-2 border-b border-[#23272F] pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-bold uppercase">
          <Boxes className="w-3.5 h-3.5" />
          <span>Section 21: Authoritative Stock Dashboard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F5F7FA] tracking-tight font-sans">
          The hardest problem: 10,000 requests competing for 100 units.
        </h1>
        <p className="text-sm text-[#9CA3AF] max-w-3xl leading-relaxed font-sans">
          How our architecture maintains a strict, strongly-consistent authoritative inventory balance in PostgreSQL with sub-millisecond row locks and zero overselling.
        </p>
      </div>

      {/* Live Physical Stock Dashboard (Section 21) */}
      <div className="p-6 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23272F] pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-indigo-400">Live State Gauges</span>
            <h3 className="text-base font-bold text-[#F5F7FA] font-sans mt-0.5">
              Real-Time Inventory Allocation
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateDepletion}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isSimulating ? 'Allocating Stock...' : 'Simulate 100-Unit Allocation'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-[8px] bg-[#13161B] text-[#9CA3AF] hover:text-white border border-[#23272F]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#13161B] text-center">
            <span className="text-[11px] uppercase font-semibold text-[#9CA3AF]">AVAILABLE</span>
            <div className="text-3xl font-bold text-[#10B981] mt-1">{availableStock}</div>
            <span className="text-[10px] text-[#6B7280]">Ready to Claim</span>
          </div>

          <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#13161B] text-center">
            <span className="text-[11px] uppercase font-semibold text-[#9CA3AF]">RESERVED</span>
            <div className="text-3xl font-bold text-[#F59E0B] mt-1">{reservedStock}</div>
            <span className="text-[10px] text-[#6B7280]">5-Min Checkout Leases</span>
          </div>

          <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#13161B] text-center">
            <span className="text-[11px] uppercase font-semibold text-[#9CA3AF]">SOLD</span>
            <div className="text-3xl font-bold text-indigo-400 mt-1">{soldStock}</div>
            <span className="text-[10px] text-[#6B7280]">Confirmed & Captured</span>
          </div>
        </div>

        {/* Horizontal Inventory Allocation Bar (Section 21 specification) */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between text-[#9CA3AF] text-[11px]">
            <span>Inventory Distribution:</span>
            <span>Total: 100 Units</span>
          </div>

          {/* Composite Bar */}
          <div className="h-6 w-full rounded-[8px] bg-[#08090B] border border-[#23272F] overflow-hidden flex transition-all duration-500">
            <div
              style={{ width: `${availPct}%` }}
              className="bg-[#10B981] transition-all duration-500 flex items-center justify-center text-[10px] text-slate-950 font-bold overflow-hidden"
              title={`Available: ${availableStock}`}
            >
              {availableStock > 10 ? `${availableStock}` : ''}
            </div>
            <div
              style={{ width: `${resPct}%` }}
              className="bg-[#F59E0B] transition-all duration-500 flex items-center justify-center text-[10px] text-slate-950 font-bold overflow-hidden"
              title={`Reserved: ${reservedStock}`}
            >
              {reservedStock > 10 ? `${reservedStock}` : ''}
            </div>
            <div
              style={{ width: `${soldPct}%` }}
              className="bg-[#6366F1] transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold overflow-hidden"
              title={`Sold: ${soldStock}`}
            >
              {soldStock > 10 ? `${soldStock}` : ''}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#10B981]">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#10B981]" />
              <span>Available ({availableStock})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#F59E0B]">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#F59E0B]" />
              <span>Reserved ({reservedStock})</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#6366F1]" />
              <span>Sold ({soldStock})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee Card */}
      <GuaranteeCard />

      {/* Safe vs Unsafe Concurrency Comparison (Section 22 & 23) */}
      <ConcurrencyDemo />
    </div>
  );
};
