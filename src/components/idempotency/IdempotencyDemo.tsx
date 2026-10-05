import React, { useState } from 'react';
import { Cpu, CheckCircle2, RotateCcw, Copy, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

interface RequestHistoryItem {
  attempt: number;
  time: string;
  status: 'PROCESSED' | 'REPLAYED_FROM_CACHE';
  httpCode: number;
  message: string;
}

export const IdempotencyDemo: React.FC = () => {
  const [key, setKey] = useState<string>('flash-buy-uuid-9921-bc');
  const [payload, setPayload] = useState<string>(JSON.stringify({ productId: 'prod-001', quantity: 1, amountCents: 19900 }, null, 2));
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsProcessing(true);
    const attemptNumber = history.length + 1;
    const now = new Date().toISOString().substring(11, 23);

    setTimeout(() => {
      if (attemptNumber === 1) {
        // First submission: executed and saved to DB
        setHistory(prev => [
          ...prev,
          {
            attempt: attemptNumber,
            time: now,
            status: 'PROCESSED',
            httpCode: 201,
            message: `Key '${key}' committed. Payment captured and reservation assigned.`
          }
        ]);
      } else {
        // Subsequent submissions with identical key: intercepted & cached result replayed
        setHistory(prev => [
          ...prev,
          {
            attempt: attemptNumber,
            time: now,
            status: 'REPLAYED_FROM_CACHE',
            httpCode: 200,
            message: `Idempotency match found! Zero duplicate charge. Replayed cached receipt.`
          }
        ]);
      }
      setIsProcessing(false);
    }, 400);
  };

  const handleReset = () => {
    setHistory([]);
    setKey(`flash-buy-uuid-${Math.floor(1000 + Math.random() * 9000)}-bc`);
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Section 23: Idempotency Guarantees</span>
          <h3 className="text-base font-bold text-white mt-1">
            Interactive Idempotency Key Deduplication Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how multiple aggressive clicks or network retries are deduplicated using client keys and unique constraints.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Idempotency Key</span>
        </button>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase font-bold text-slate-400 block mb-1.5">
              Client Idempotency Key Header (<code className="text-amber-400">Idempotency-Key</code>)
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-300 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase font-bold text-slate-400 block mb-1.5">
              Request Payload (JSON)
            </label>
            <textarea
              rows={4}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-slate-300 outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Request...' : `Submit Request (Attempt #${history.length + 1})`}</span>
          </button>
        </div>

        {/* History / Output stream */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                Server Request Ledger
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {history.length} Attempt{history.length !== 1 ? 's' : ''} Received
              </span>
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-slate-600">
                Click "Submit Request" to fire Request #1. Then click again to test duplicate handling.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      item.status === 'PROCESSED'
                        ? 'border-emerald-500/40 bg-emerald-950/30'
                        : 'border-cyan-500/40 bg-cyan-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        Request #{item.attempt} ({item.time})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.httpCode === 201 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}>
                        HTTP {item.httpCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {history.length > 1 && (
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Deduplication Success: 0 duplicate charges! Client received identical response.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
