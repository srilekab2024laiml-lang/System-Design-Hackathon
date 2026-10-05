import React, { useState } from 'react';
import { TestTube2, CheckCircle2, Play, RotateCcw, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';

export const TestingPage: React.FC = () => {
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string[] | null>(null);

  const testSuites = [
    { name: 'Unit Tests', count: '142 Passed', coverage: '94% Line Coverage', desc: 'Validates state machine transitions, JWT parsing, and idempotency key hashing.' },
    { name: 'Integration Tests', count: '58 Passed', coverage: 'End-to-End API Flow', desc: 'Validates multi-step checkout with simulated PostgreSQL and Kafka testcontainers.' },
    { name: 'Concurrency Tests', count: '10,000 Threads', coverage: 'Jepsen Invariant Suite', desc: 'Executes parallel atomic conditional UPDATE statements; asserts 0 oversell.' },
    { name: 'Load & Stress Tests', count: '15,000 RPS Peak', coverage: 'k6 / Distributed Locust', desc: 'Measures P95 latency (<250ms target) and PgBouncer connection multiplexing.' },
    { name: 'Chaos & Partition Tests', count: '12 Scenarios', coverage: 'Chaos Mesh / Toxiproxy', desc: 'Simulates network latency injection, primary database failover, and Redis node kills.' }
  ];

  const handleRunLoadTest = () => {
    setIsRunningTest(true);
    setTestOutput(['[INIT] Initializing distributed k6 load testing workers across 5 nodes...']);

    setTimeout(() => {
      setTestOutput(prev => [...(prev || []), '[TARGET] Target URL: POST /api/v1/reservations (Flash Sale Product: HEX-CON-001, Initial Stock: 100)']);
    }, 600);

    setTimeout(() => {
      setTestOutput(prev => [...(prev || []), '[RAMP] Ramping to 10,000 concurrent Virtual Users (VUs) at T=0...']);
    }, 1400);

    setTimeout(() => {
      setTestOutput(prev => [...(prev || []), '[EXEC] 10,000 atomic reservation requests submitted within 220ms window.']);
    }, 2200);

    setTimeout(() => {
      setTestOutput(prev => [
        ...(prev || []),
        '[METRICS] Requests completed: 10,000 | P50: 38ms | P95: 84ms | P99: 142ms',
        '[ASSERT 1] Successful reservations == 100: PASSED (100 / 100)',
        '[ASSERT 2] Overselling count == 0: PASSED (0 oversold)',
        '[ASSERT 3] Available inventory >= 0: PASSED (0 remaining)',
        '[ASSERT 4] Duplicate orders for identical user == 0: PASSED (0 duplicates)',
        '[VERDICT] ALL 4 CRITICAL INVARIANTS PASSED SUCCESSFULLY. ZERO OVERSELL VERIFIED.'
      ]);
      setIsRunningTest(false);
    }, 3200);
  };

  const handleReset = () => {
    setTestOutput(null);
    setIsRunningTest(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <TestTube2 className="w-3.5 h-3.5" />
          <span>Section 32: Verification & Chaos Testing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Concurrency Testing & Verification Suite
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          How our testing pyramid and automated Jepsen-style concurrency assertions mathematically verify that zero oversell and zero duplicate charges occur under peak load.
        </p>
      </div>

      {/* Test Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testSuites.map((ts, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-white">{ts.name}</span>
              <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                {ts.count}
              </span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400">{ts.coverage}</div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">{ts.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Load Test Runner (Section 32) */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">Section 32: Concurrency Load Test Runner</span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Simulate 10,000 Concurrent VUs Against 100 Stock Units
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunLoadTest}
              disabled={isRunningTest}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-950/60 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunningTest ? 'Running Concurrency Test...' : 'RUN CONCURRENCY TEST'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expected Invariant Assertions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Concurrent Users</span>
            <span className="text-white font-bold text-sm">10,000 VUs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Expected Sales</span>
            <span className="text-emerald-400 font-bold text-sm">&le; 100 Units</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Expected Overselling</span>
            <span className="text-emerald-400 font-bold text-sm">0 (Strict)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Duplicate Orders</span>
            <span className="text-emerald-400 font-bold text-sm">0 Allowed</span>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="rounded-xl border border-slate-800 bg-[#070b14] overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-300">
                k6 Test Execution Console Output
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {isRunningTest ? 'STATUS: EXECUTING' : testOutput ? 'STATUS: FINISHED' : 'STATUS: IDLE'}
            </span>
          </div>

          <div className="p-4 font-mono text-xs text-slate-200 min-h-[160px] max-h-60 overflow-y-auto space-y-1.5 leading-relaxed">
            {testOutput ? (
              testOutput.map((line, idx) => (
                <div key={idx} className={line.includes('PASSED') ? 'text-emerald-400 font-bold' : line.includes('[INIT]') ? 'text-cyan-400' : 'text-slate-300'}>
                  {line}
                </div>
              ))
            ) : (
              <div className="text-slate-600 italic py-8 text-center">
                Click "RUN CONCURRENCY TEST" above to execute simulated distributed k6 load testing against 100 stock units.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
