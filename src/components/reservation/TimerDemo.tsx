import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TimerDemo: React.FC = () => {
  const INITIAL_SECONDS = 30; // 30-second lease demo
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SECONDS);
  const [status, setStatus] = useState<'PAYMENT_PENDING' | 'EXPIRED' | 'RELEASED' | 'CONFIRMED'>('PAYMENT_PENDING');
  const [availableStock, setAvailableStock] = useState<number>(99);
  const [reservedStock, setReservedStock] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && status === 'PAYMENT_PENDING' && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && status === 'PAYMENT_PENDING') {
      setStatus('EXPIRED');
      setTimeout(() => {
        setStatus('RELEASED');
        setReservedStock(0);
        setAvailableStock((prev) => prev + 1);
      }, 1400);
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, status]);

  const handlePayNow = () => {
    if (status === 'PAYMENT_PENDING') {
      setIsRunning(false);
      setStatus('CONFIRMED');
      setReservedStock(0);
    }
  };

  const handleReset = () => {
    setSecondsLeft(INITIAL_SECONDS);
    setStatus('PAYMENT_PENDING');
    setAvailableStock(99);
    setReservedStock(1);
    setIsRunning(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Circular progress calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / INITIAL_SECONDS) * circumference;

  return (
    <div className="p-6 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23272F] pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase text-amber-400">
            Section 25: Reservation Timer & Lease Expiry
          </span>
          <h3 className="text-base font-bold text-[#F5F7FA] font-sans mt-0.5">
            Auto-Release Countdown with Circular Lease Indicator
          </h3>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#13161B] hover:bg-[#181C22] border border-[#23272F] text-xs font-mono text-[#F5F7FA] transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset 30s Timer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reservation Card with Circular Timer */}
        <div className="md:col-span-2 rounded-[12px] border border-[#23272F] bg-[#13161B] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-[#F5F7FA]">Reservation #R-20481</div>
              <div className="text-[11px] text-[#9CA3AF] font-mono mt-0.5">Product X &times; 1</div>
            </div>
            <span className={`px-2.5 py-1 rounded-[6px] text-xs font-mono font-bold ${
              status === 'PAYMENT_PENDING' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40' :
              status === 'CONFIRMED' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' :
              status === 'EXPIRED' ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40' :
              'bg-blue-950 text-blue-400 border border-blue-800'
            }`}>
              {status}
            </span>
          </div>

          {/* Circular Countdown Progress UI (Section 25) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90 transform">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#23272F"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke={status === 'CONFIRMED' ? '#10B981' : secondsLeft <= 5 ? '#EF4444' : '#F59E0B'}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={status === 'CONFIRMED' ? 0 : strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-mono uppercase font-bold text-[#9CA3AF]">
                  RESERVATION EXPIRES IN
                </span>
                <span className="text-2xl font-mono font-black tracking-tight text-[#F5F7FA]">
                  {status === 'CONFIRMED' ? 'SETTLED' : status === 'EXPIRED' ? '00:00' : formatTimer(secondsLeft)}
                </span>
                <span className="text-[9px] font-mono text-[#6B7280]">
                  {status === 'PAYMENT_PENDING' ? 'Active Lease' : status}
                </span>
              </div>
            </div>

            {/* Quick Action */}
            <div className="space-y-3 text-center sm:text-left">
              <div className="text-xs text-[#9CA3AF] font-sans">
                Customer is currently entering card details. Inventory is held exclusively for this session.
              </div>
              {status === 'PAYMENT_PENDING' && (
                <button
                  onClick={handlePayNow}
                  className="px-4 py-2 rounded-[8px] bg-[#10B981] hover:bg-[#059669] text-white font-mono text-xs font-bold transition-all shadow-sm"
                >
                  Pay Now ($199.00)
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Status Notifications */}
          {status === 'EXPIRED' && (
            <div className="p-3 rounded-[8px] bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-mono text-[#EF4444] flex items-center gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>EXPIRED: Timer reached zero! Releasing inventory holding lock...</span>
            </div>
          )}

          {status === 'RELEASED' && (
            <div className="p-3 rounded-[8px] bg-blue-950/40 border border-blue-800 text-xs font-mono text-blue-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Inventory Released: Physical stock incremented back to available pool.</span>
            </div>
          )}

          {status === 'CONFIRMED' && (
            <div className="p-3 rounded-[8px] bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-mono text-[#10B981] flex items-center gap-2 animate-fade-in">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Payment Captured: Order ORD-20481 created! Stock permanently marked as SOLD.</span>
            </div>
          )}
        </div>

        {/* Live Inventory Counter Panel */}
        <div className="rounded-[12px] border border-[#23272F] bg-[#13161B] p-5 flex flex-col justify-between font-mono text-xs">
          <div>
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">
              Authoritative Inventory State
            </span>
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#08090B] border border-[#23272F]">
                <span className="text-[#9CA3AF]">Available Stock:</span>
                <span className="text-base font-bold text-[#10B981]">{availableStock}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#08090B] border border-[#23272F]">
                <span className="text-[#9CA3AF]">Reserved:</span>
                <span className="text-base font-bold text-[#F59E0B]">{reservedStock}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#08090B] border border-[#23272F]">
                <span className="text-[#9CA3AF]">Sold:</span>
                <span className="text-base font-bold text-indigo-400">{status === 'CONFIRMED' ? 1 : 0}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#23272F] text-[10px] text-[#6B7280]">
            Invariant: Available + Reserved + Sold = 100 Physical Units at all times.
          </div>
        </div>
      </div>
    </div>
  );
};
