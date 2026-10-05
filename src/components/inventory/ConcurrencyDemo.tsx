import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Play, RotateCcw, ShieldCheck, ShieldAlert, Users, ArrowRight } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

export const ConcurrencyDemo: React.FC = () => {
  const [mode, setMode] = useState<'safe' | 'unsafe'>('safe');
  const [step, setStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const usersList = ['User A', 'User B', 'User C', 'User D', 'User E'];

  const unsafeCode = `-- UNSAFE APPLICATION LOGIC (VULNERABLE TO RACE CONDITIONS)
-- Step 1: Read stock
SELECT available_quantity FROM inventory WHERE product_id = 'prod-001';

-- Step 2: Application checks in Node.js/Go memory
-- IF available_quantity > 0 THEN

-- Step 3: Write back decremented balance (TOO LATE! Race condition collision)
UPDATE inventory 
SET available_quantity = available_quantity - 1 
WHERE product_id = 'prod-001';`;

  const safeCode = `-- SALESTORM SAFE ATOMIC CONDITIONAL UPDATE
-- Both the evaluation AND decrement execute in ONE atomic storage engine operation
UPDATE inventory
SET 
    available_quantity = available_quantity - :quantity,
    reserved_quantity  = reserved_quantity  + :quantity,
    version            = version + 1,
    updated_at         = CURRENT_TIMESTAMP
WHERE 
    product_id = :product_id 
    AND available_quantity >= :quantity;

-- Row lock held for <20 microseconds.
-- If 0 rows affected -> stock is 0 -> instantly returns HTTP 409 OUT_OF_STOCK.`;

  const handleSimulate = () => {
    setIsSimulating(true);
    setStep(1);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2200);
    setTimeout(() => {
      setStep(4);
      setIsSimulating(false);
    }, 3200);
  };

  const handleReset = () => {
    setStep(0);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher Banner (Section 22 & 23) */}
      <div className="p-5 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-indigo-400">Section 22 & 23: Concurrency Engine</span>
            <h3 className="text-base font-bold text-[#F5F7FA] font-sans mt-0.5">
              Visual Race Condition: Safe vs Unsafe Architecture
            </h3>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-1 rounded-[8px] border border-[#23272F] bg-[#08090B] p-1 font-mono text-xs">
            <button
              onClick={() => { setMode('safe'); handleReset(); }}
              className={`px-3 py-1.5 rounded-[6px] font-bold transition-all ${
                mode === 'safe'
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              Safe (Atomic Reservation)
            </button>
            <button
              onClick={() => { setMode('unsafe'); handleReset(); }}
              className={`px-3 py-1.5 rounded-[6px] font-bold transition-all ${
                mode === 'unsafe'
                  ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              Unsafe (READ &rarr; CHECK &rarr; WRITE)
            </button>
          </div>
        </div>

        {/* Educational label if Unsafe */}
        {mode === 'unsafe' && (
          <div className="p-3 rounded-[8px] bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-mono text-[#EF4444] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Educational simulation — not production behavior. Demonstrates how naive architectures cause overselling.</span>
          </div>
        )}
      </div>

      {/* Visual Multi-User Concurrency Funnel (Section 22) */}
      <div className="p-6 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-[#F5F7FA]">5 Concurrent Users Colliding at T=0 (Remaining Stock = 1 Unit)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-50 text-xs font-mono font-bold text-white transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isSimulating ? 'Simulating Race...' : 'Simulate Concurrency Race'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-[8px] bg-[#13161B] text-[#9CA3AF] hover:text-white border border-[#23272F]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The 5 Users visual race */}
        <div className="space-y-2 font-mono text-xs">
          {usersList.map((user, idx) => {
            const isWinner = idx === 0;
            return (
              <div
                key={idx}
                className="p-3 rounded-[10px] border border-[#23272F] bg-[#13161B] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-20 font-bold text-[#F5F7FA]">{user}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#323846]" />
                  <span className="text-[#9CA3AF]">
                    {step === 0 && 'Ready to submit Buy Now'}
                    {step === 1 && (mode === 'safe' ? 'Executing atomic UPDATE' : 'Reads: Available Stock = 1')}
                    {step === 2 && (mode === 'safe' ? (isWinner ? 'Acquired row lock -> decremented' : 'Queued behind lock') : 'Checks: 1 > 0 is TRUE')}
                    {step >= 3 && (mode === 'safe' ? (isWinner ? 'Decremented stock to 0 -> COMMIT' : 'Evaluates available >= 1 -> FALSE (0 rows affected)') : 'Writes: Stock = Stock - 1 (Decrements blindly!)')}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                  step < 3 ? 'bg-[#08090B] text-[#6B7280]' :
                  mode === 'safe'
                    ? isWinner ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : 'bg-[#13161B] text-[#9CA3AF]'
                    : isWinner ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                }`}>
                  {step < 3 ? 'PENDING' :
                   mode === 'safe'
                     ? isWinner ? 'RESERVED (1 Unit)' : 'OUT OF STOCK (409)'
                     : isWinner ? 'RESERVED' : 'OVERSELL BUG!'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Outcome Box */}
        {step >= 3 && (
          <div className={`p-4 rounded-[10px] border font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in ${
            mode === 'safe'
              ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]'
              : 'border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]'
          }`}>
            <div>
              <strong>Final Physical Stock:</strong> {mode === 'safe' ? '0 Units (Preserved)' : '-4 Units (Negative / Oversold)'}
            </div>
            <div>
              <strong>Confirmed Sales:</strong> {mode === 'safe' ? '1 Sale (100% Invariant Compliant)' : '5 Sales (4 Fake Orders)'}
            </div>
          </div>
        )}
      </div>

      {/* Code Inspection */}
      <CodeBlock
        title={mode === 'safe' ? 'Safe: Single-Statement Atomic Conditional Update' : 'Unsafe: Vulnerable Read-Check-Write Application Code'}
        language="sql"
        code={mode === 'safe' ? safeCode : unsafeCode}
      />
    </div>
  );
};
