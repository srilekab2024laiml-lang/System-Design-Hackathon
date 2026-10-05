import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Users,
  Boxes,
  CreditCard,
  PackageCheck,
  Clock,
  Radio,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { runSimulation, SimulationConfig, SimulationResult, SimulationLogEntry } from './SimulationEngine';

export const SimulationDashboard: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    customers: 10000,
    inventory: 100,
    quantityPerCustomer: 1,
    paymentFailureRate: 5,
    networkFailureRate: 2,
    orderServiceFailure: false,
    reservationTimeoutRate: 3,
    isUnsafeMode: false
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<string>('ALL');

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runSimulation(config);
      setResult(res);
      setIsRunning(false);
    }, 400);
  };

  const loadScenario = (scenarioNum: number) => {
    switch (scenarioNum) {
      case 1: // Normal Flash Sale
        setConfig({
          customers: 10000,
          inventory: 100,
          quantityPerCustomer: 1,
          paymentFailureRate: 0,
          networkFailureRate: 0,
          orderServiceFailure: false,
          reservationTimeoutRate: 0,
          isUnsafeMode: false
        });
        break;
      case 2: // Payment Failure
        setConfig({
          customers: 10000,
          inventory: 100,
          quantityPerCustomer: 1,
          paymentFailureRate: 15,
          networkFailureRate: 0,
          orderServiceFailure: false,
          reservationTimeoutRate: 0,
          isUnsafeMode: false
        });
        break;
      case 3: // Payment Timeout
        setConfig({
          customers: 10000,
          inventory: 100,
          quantityPerCustomer: 1,
          paymentFailureRate: 5,
          networkFailureRate: 10,
          orderServiceFailure: false,
          reservationTimeoutRate: 0,
          isUnsafeMode: false
        });
        break;
      case 4: // Order Service Down
        setConfig({
          customers: 10000,
          inventory: 100,
          quantityPerCustomer: 1,
          paymentFailureRate: 0,
          networkFailureRate: 0,
          orderServiceFailure: true,
          reservationTimeoutRate: 0,
          isUnsafeMode: false
        });
        break;
      case 5: // Duplicate Requests
        setConfig({
          customers: 12000,
          inventory: 100,
          quantityPerCustomer: 1,
          paymentFailureRate: 0,
          networkFailureRate: 0,
          orderServiceFailure: false,
          reservationTimeoutRate: 0,
          isUnsafeMode: false
        });
        break;
      case 6: // Reservation Expiry
        setConfig({
          customers: 10000,
          inventory: 100,
          quantityPerCustomer: 1,
          paymentFailureRate: 0,
          networkFailureRate: 0,
          orderServiceFailure: false,
          reservationTimeoutRate: 20,
          isUnsafeMode: false
        });
        break;
      case 7: // Traffic Surge 50k
        setConfig({
          customers: 50000,
          inventory: 100,
          quantityPerCustomer: 1,
          paymentFailureRate: 5,
          networkFailureRate: 3,
          orderServiceFailure: false,
          reservationTimeoutRate: 5,
          isUnsafeMode: false
        });
        break;
    }
    setResult(null);
  };

  const filteredLogs = result?.logs.filter(l => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'SUCCESS') return l.status === 'success';
    if (logFilter === 'WARNING') return l.status === 'warning';
    if (logFilter === 'ERROR') return l.status === 'error';
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Top Pre-configured Demo Scenarios Buttons */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-slate-400">
            Quick-Load Hackathon Test Scenarios (Click to Load)
          </span>
          <span className="text-[11px] font-mono text-cyan-400">Section 51</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadScenario(1)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            1. Normal Sale (10k/100)
          </button>
          <button
            onClick={() => loadScenario(2)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            2. Payment Failures (15%)
          </button>
          <button
            onClick={() => loadScenario(3)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            3. Network Drop (10%)
          </button>
          <button
            onClick={() => loadScenario(4)}
            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 text-xs font-mono text-amber-300 transition-colors"
          >
            4. Order Service DOWN
          </button>
          <button
            onClick={() => loadScenario(5)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            5. Duplicate Clicks
          </button>
          <button
            onClick={() => loadScenario(6)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            6. Cart Abandonment (20%)
          </button>
          <button
            onClick={() => loadScenario(7)}
            className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800 text-xs font-mono text-purple-300 transition-colors"
          >
            7. 50K Mega Surge
          </button>
        </div>
      </div>

      {/* Control Knobs & Invariant Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knobs Panel */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Simulation Knobs</span>
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Deterministic
            </span>
          </div>

          {/* Architecture Mode Toggle */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400 block">
              Concurrency Architecture Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, isUnsafeMode: false }))}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  !config.isUnsafeMode
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-400 shadow'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Safe (Atomic SQL)
              </button>
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, isUnsafeMode: true }))}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  config.isUnsafeMode
                    ? 'bg-rose-950 border border-rose-500 text-rose-400 shadow'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Unsafe (Race Bug)
              </button>
            </div>
            {config.isUnsafeMode && (
              <p className="text-[10px] text-rose-400 font-mono">
                ▲ Educational race-condition simulation demonstrating overselling.
              </p>
            )}
          </div>

          {/* Concurrent Customers */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Concurrent Customers:</span>
              <span className="text-cyan-400 font-bold">{config.customers.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={config.customers}
              onChange={(e) => setConfig({ ...config, customers: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Physical Inventory */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Physical Stock:</span>
              <span className="text-white font-bold">{config.inventory} Units</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={config.inventory}
              onChange={(e) => setConfig({ ...config, inventory: Number(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Payment Failure Rate */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Payment Decline Rate:</span>
              <span className="text-amber-400 font-bold">{config.paymentFailureRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={config.paymentFailureRate}
              onChange={(e) => setConfig({ ...config, paymentFailureRate: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Reservation Abandonment */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Cart Abandonment (Timeout):</span>
              <span className="text-purple-400 font-bold">{config.reservationTimeoutRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={config.reservationTimeoutRate}
              onChange={(e) => setConfig({ ...config, reservationTimeoutRate: Number(e.target.value) })}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Order Service Down toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
            <div>
              <span className="text-xs font-mono font-bold text-white block">Order Service Outage</span>
              <span className="text-[10px] text-slate-400 font-mono">Tests Outbox buffering</span>
            </div>
            <button
              onClick={() => setConfig(prev => ({ ...prev, orderServiceFailure: !prev.orderServiceFailure }))}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                config.orderServiceFailure ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.orderServiceFailure ? 'DOWN (503)' : 'ONLINE'}
            </button>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-xl shadow-cyan-950/60 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'SIMULATING FLASH SALE...' : 'RUN FLASH SALE SIMULATION'}</span>
          </button>
        </div>

        {/* Results & Verification Panel */}
        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <div className="space-y-4 animate-fade-in">
              {/* Invariant Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                result.invariantPassed
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-rose-500/50 bg-rose-950/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-3">
                  {result.invariantPassed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold font-mono uppercase">
                      {result.invariantPassed
                        ? 'INVARIANT PASSED: ZERO OVERSELLING DETECTED'
                        : 'INVARIANT VIOLATED (EDUCATIONAL UNSAFE DEMO)'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {result.invariantPassed
                        ? `Processed ${result.totalRequests.toLocaleString()} requests in ${result.executionTimeMs}ms. Exactly ${result.successfulSales} sales confirmed out of ${result.initialStock} units.`
                        : `Race conditions caused ${result.oversoldUnits} units to be oversold! Physical stock is negative.`}
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono shrink-0 hidden sm:block">
                  <div className="text-[10px] uppercase text-slate-400">Execution Time</div>
                  <div className="text-base font-bold text-white">{result.executionTimeMs}ms</div>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Requests</div>
                  <div className="text-xl font-bold text-white mt-1">{result.totalRequests.toLocaleString()}</div>
                  <div className="text-[10px] text-cyan-400">Peak Burst</div>
                </div>

                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30">
                  <div className="text-[10px] text-emerald-400 uppercase font-semibold">Confirmed Sales</div>
                  <div className="text-xl font-bold text-emerald-300 mt-1">{result.successfulSales}</div>
                  <div className="text-[10px] text-emerald-400">Physical Cap: {result.initialStock}</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Out of Stock (Rejected)</div>
                  <div className="text-xl font-bold text-slate-300 mt-1">{result.rejectedOutOfStock.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">Fast 409 Fail</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  result.oversoldUnits === 0 ? 'border-emerald-500/40 bg-emerald-950/40' : 'border-rose-500/60 bg-rose-950/40'
                }`}>
                  <div className="text-[10px] uppercase font-semibold text-slate-300">Oversold Units</div>
                  <div className={`text-xl font-bold mt-1 ${result.oversoldUnits === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.oversoldUnits}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold">
                    {result.oversoldUnits === 0 ? 'Zero Oversell ✓' : 'VIOLATION!'}
                  </div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 block text-[10px] uppercase">Duplicate Clicks Blocked</span>
                  <span className="font-bold text-cyan-400 mt-0.5 block">{result.duplicateRequestsPrevented}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 block text-[10px] uppercase">Payment Failures</span>
                  <span className="font-bold text-amber-400 mt-0.5 block">{result.paymentFailures} (Stock Restored)</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 block text-[10px] uppercase">Abandoned & Released</span>
                  <span className="font-bold text-purple-400 mt-0.5 block">{result.abandonedAndReleased}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 block text-[10px] uppercase">Outbox Buffered</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">{result.orderServiceBuffered}</span>
                </div>
              </div>

              {/* Live Transaction Log Stream */}
              <div className="rounded-xl border border-slate-800 bg-[#070b14] overflow-hidden">
                <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      Live Transaction Log ({filteredLogs.length} Events)
                    </span>
                  </div>

                  {/* Filter Badges */}
                  <div className="flex gap-1">
                    {(['ALL', 'SUCCESS', 'WARNING', 'ERROR'] as const).map(flt => (
                      <button
                        key={flt}
                        onClick={() => setLogFilter(flt)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          logFilter === flt ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {flt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto p-3 space-y-1 font-mono text-xs">
                  {filteredLogs.slice(0, 150).map((log) => (
                    <div
                      key={log.id}
                      className="p-1.5 rounded hover:bg-slate-900/60 flex items-start gap-2 border-b border-slate-900/60"
                    >
                      <span className="text-slate-500 shrink-0 text-[10px]">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                        log.status === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        log.status === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        log.status === 'error' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-cyan-400 shrink-0 text-[11px] font-bold">{log.userId}:</span>
                      <span className="text-slate-300 text-[11px] font-sans truncate">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40">
              <Zap className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
              <h4 className="text-sm font-mono font-bold text-white">
                Simulation Engine Ready
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Configure parameters on the left or select a scenario above, then click <strong>"RUN FLASH SALE SIMULATION"</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
