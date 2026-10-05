import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

export const PaymentScenarios: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'success' | 'failure' | 'timeout'>('success');
  const [scenarioStep, setScenarioStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [availableStock, setAvailableStock] = useState<number>(99);
  const [reservedStock, setReservedStock] = useState<number>(1);

  const handleSimulate = (scenario: 'success' | 'failure' | 'timeout') => {
    setActiveScenario(scenario);
    setIsSimulating(true);
    setScenarioStep(1);

    setTimeout(() => {
      setScenarioStep(2);
    }, 1000);

    setTimeout(() => {
      setScenarioStep(3);
      if (scenario === 'failure') {
        // Section 27: Payment FAILED -> Reservation Released -> Inventory Restored (numbers visibly change!)
        setReservedStock(0);
        setAvailableStock(100);
      } else if (scenario === 'success') {
        setReservedStock(0);
      }
      setIsSimulating(false);
    }, 2200);
  };

  const handleReset = () => {
    setScenarioStep(0);
    setAvailableStock(99);
    setReservedStock(1);
    setIsSimulating(false);
  };

  return (
    <div className="p-6 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23272F] pb-4">
        <div>
          <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase">
            Section 26 & 27: Payment Lifecycle & Failure Recovery
          </span>
          <h3 className="text-base font-bold text-[#F5F7FA] font-sans mt-0.5">
            Three Core Gateway Branches & Live Stock Restoral
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulate('success')}
            disabled={isSimulating}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-bold transition-all ${
              activeScenario === 'success'
                ? 'bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]'
                : 'bg-[#13161B] border border-[#23272F] text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            1. Success
          </button>
          <button
            onClick={() => handleSimulate('failure')}
            disabled={isSimulating}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-bold transition-all ${
              activeScenario === 'failure'
                ? 'bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444]'
                : 'bg-[#13161B] border border-[#23272F] text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            2. Simulate Payment Failure
          </button>
          <button
            onClick={() => handleSimulate('timeout')}
            disabled={isSimulating}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-bold transition-all ${
              activeScenario === 'timeout'
                ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B]'
                : 'bg-[#13161B] border border-[#23272F] text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            3. Gateway Timeout
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-[8px] bg-[#13161B] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#23272F]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Physical Stock Indicator Showing Visible Change (Section 27) */}
      <div className="p-3.5 rounded-[10px] bg-[#13161B] border border-[#23272F] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#9CA3AF]">Live Stock Reaction:</span>
          <span className="text-[#F5F7FA]">Available: <strong className="text-[#10B981]">{availableStock}</strong></span>
          <span className="text-[#323846]">|</span>
          <span className="text-[#F5F7FA]">Reserved: <strong className="text-[#F59E0B]">{reservedStock}</strong></span>
        </div>
        {activeScenario === 'failure' && scenarioStep === 3 && (
          <span className="text-[#10B981] text-[11px] font-bold flex items-center gap-1 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Inventory Restored (+1 back to pool)
          </span>
        )}
      </div>

      {/* Scenario Pipeline Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Step 1: Checkout Submission */}
        <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#13161B] space-y-2">
          <div className="text-[10px] uppercase font-bold text-[#6B7280]">1. Ingress Request</div>
          <div className="text-xs font-bold text-[#F5F7FA]">POST /payments/charge</div>
          <p className="text-[#9CA3AF] text-[11px] font-sans">
            Client sends card token with mandatory <code className="text-indigo-400">Idempotency-Key</code>.
          </p>
          <div className="pt-1 text-[10px] text-[#10B981] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Reservation Verified Active
          </div>
        </div>

        {/* Step 2: Gateway Adaptor */}
        <div className={`p-4 rounded-[12px] border transition-all space-y-2 ${
          scenarioStep >= 2
            ? activeScenario === 'success' ? 'border-[#10B981]/40 bg-[#10B981]/10' :
              activeScenario === 'failure' ? 'border-[#EF4444]/40 bg-[#EF4444]/10' :
              'border-[#F59E0B]/40 bg-[#F59E0B]/10'
            : 'border-[#23272F] bg-[#13161B]'
        }`}>
          <div className="text-[10px] uppercase font-bold text-[#6B7280]">2. Payment Provider Branch</div>
          <div className="text-xs font-bold text-[#F5F7FA]">
            {activeScenario === 'success' && 'SUCCESS: 200 Captured'}
            {activeScenario === 'failure' && 'FAILED: Insufficient Funds'}
            {activeScenario === 'timeout' && 'TIMEOUT: HTTP 504'}
          </div>
          <p className="text-[#9CA3AF] text-[11px] font-sans">
            {activeScenario === 'success' && 'Funds captured from Visa/Mastercard network.'}
            {activeScenario === 'failure' && 'Issuing bank declined. Triggers release.'}
            {activeScenario === 'timeout' && 'Network drop before ACK. Triggers status verify.'}
          </p>
        </div>

        {/* Step 3: Resolution */}
        <div className={`p-4 rounded-[12px] border transition-all space-y-2 ${
          scenarioStep >= 3
            ? activeScenario === 'success' ? 'border-[#10B981]/40 bg-[#10B981]/10' :
              activeScenario === 'failure' ? 'border-[#10B981]/40 bg-[#10B981]/10' :
              'border-indigo-500/40 bg-indigo-950/20'
            : 'border-[#23272F] bg-[#13161B]'
        }`}>
          <div className="text-[10px] uppercase font-bold text-[#6B7280]">3. System Resolution</div>
          <div className="text-xs font-bold text-[#F5F7FA]">
            {activeScenario === 'success' && 'Order Confirmed (ORD-XXXX)'}
            {activeScenario === 'failure' && 'Reservation Released -> Stock Restored'}
            {activeScenario === 'timeout' && 'Out-of-Band Status Reconciliation'}
          </div>
          <p className="text-[#9CA3AF] text-[11px] font-sans">
            {activeScenario === 'success' && 'Transactional Outbox event committed; customer receives receipt.'}
            {activeScenario === 'failure' && 'Stock returned to pool (+1) for waiting customers.'}
            {activeScenario === 'timeout' && 'GET /charges verification hook resolves without orphaned payments.'}
          </p>
        </div>
      </div>
    </div>
  );
};
