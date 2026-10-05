import React from 'react';
import { Activity, ShieldCheck, Database, Radio, Clock, AlertTriangle, ArrowUpRight, Terminal } from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export const TelemetryDashboard: React.FC = () => {
  // Telemetry time series data
  const trafficData = [
    { time: '12:04:15', rps: 850, p95Latency: 42, errors: 0.0, stock: 100 },
    { time: '12:04:16', rps: 9400, p95Latency: 110, errors: 0.05, stock: 82 },
    { time: '12:04:17', rps: 12400, p95Latency: 184, errors: 0.18, stock: 45 },
    { time: '12:04:18', rps: 11800, p95Latency: 215, errors: 0.12, stock: 37 },
    { time: '12:04:19', rps: 8200, p95Latency: 95, errors: 0.02, stock: 12 },
    { time: '12:04:20', rps: 5100, p95Latency: 35, errors: 0.0, stock: 0 },
    { time: '12:04:21', rps: 3200, p95Latency: 22, errors: 0.0, stock: 0 },
    { time: '12:04:22', rps: 1800, p95Latency: 18, errors: 0.0, stock: 0 },
    { time: '12:04:23', rps: 1100, p95Latency: 15, errors: 0.0, stock: 0 },
    { time: '12:04:24', rps: 600, p95Latency: 14, errors: 0.0, stock: 0 },
  ];

  // Terminal event stream (Section 35)
  const eventStream = [
    { time: '12:04:21.002', event: 'RESERVATION_CREATED', user: 'U-1021', status: 'success', detail: 'Stock: 37 -> 36' },
    { time: '12:04:21.015', event: 'PAYMENT_STARTED', user: 'U-1021', status: 'info', detail: 'Token: tok_visa_882' },
    { time: '12:04:21.082', event: 'RESERVATION_CREATED', user: 'U-8842', status: 'success', detail: 'Stock: 36 -> 35' },
    { time: '12:04:22.110', event: 'PAYMENT_SUCCESS', user: 'U-1021', status: 'success', detail: 'Amount: $199.00' },
    { time: '12:04:22.112', event: 'ORDER_CREATED', user: 'U-1021', status: 'success', detail: 'Order: ORD-1021-99' },
    { time: '12:04:22.115', event: 'SHIPMENT_REQUESTED', user: 'U-1021', status: 'info', detail: 'Carrier: FedEx Priority' },
    { time: '12:04:22.180', event: 'PAYMENT_SUCCESS', user: 'U-8842', status: 'success', detail: 'Amount: $199.00' },
    { time: '12:04:22.184', event: 'ORDER_CREATED', user: 'U-8842', status: 'success', detail: 'Order: ORD-8842-01' },
    { time: '12:04:23.010', event: 'OUT_OF_STOCK', user: 'U-9921', status: 'warning', detail: 'WHERE available >= 1 returned 0' }
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Disclaimer Callout */}
      <div className="p-3.5 rounded-[12px] border border-[#23272F] bg-[#0F1115] text-xs font-mono flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <Activity className="w-4 h-4 shrink-0" />
          <span>Section 34: Miniature Monitoring Dashboard</span>
        </div>
        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#13161B] text-[#9CA3AF] border border-[#23272F]">
          SIMULATED
        </span>
      </div>

      {/* Metric Cards Gauge (Section 34 exact specifications) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#0F1115]">
          <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold">REQUEST RATE</span>
          <div className="text-2xl font-bold text-[#F5F7FA] mt-1">12.4K/s</div>
          <span className="text-[10px] text-indigo-400">Peak Inbound</span>
        </div>

        <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#0F1115]">
          <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold">P95 LATENCY</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">184ms</div>
          <span className="text-[10px] text-amber-500">SLA &lt; 250ms</span>
        </div>

        <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#0F1115]">
          <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold">ERROR RATE</span>
          <div className="text-2xl font-bold text-[#10B981] mt-1">0.18%</div>
          <span className="text-[10px] text-[#10B981]">Healthy Target</span>
        </div>

        <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#0F1115]">
          <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold">QUEUE DEPTH</span>
          <div className="text-2xl font-bold text-[#F5F7FA] mt-1">482</div>
          <span className="text-[10px] text-purple-400">Kafka Buffer</span>
        </div>

        <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#0F1115]">
          <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold">INVENTORY</span>
          <div className="text-2xl font-bold text-[#10B981] mt-1">37</div>
          <span className="text-[10px] text-[#6B7280]">Remaining Units</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingress RPS Chart */}
        <div className="p-5 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase text-[#F5F7FA] flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Inbound Request Rate vs Stock Depletion</span>
            </h4>
            <span className="text-[10px] font-mono text-[#6B7280]">10s Burst</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorRpsSim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1E26" />
                <XAxis dataKey="time" stroke="#6B7280" tick={{ fontSize: 10 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#13161B', borderColor: '#23272F', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="rps" name="Requests/s" stroke="#6366F1" fillOpacity={1} fill="url(#colorRpsSim)" />
                <Area type="monotone" dataKey="stock" name="Stock" stroke="#10B981" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency & Error Line Chart */}
        <div className="p-5 rounded-[14px] border border-[#23272F] bg-[#0F1115] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase text-[#F5F7FA] flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>P95 Latency (ms) & Error Rate (%)</span>
            </h4>
            <span className="text-[10px] font-mono text-[#6B7280]">Real-Time SLA</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1E26" />
                <XAxis dataKey="time" stroke="#6B7280" tick={{ fontSize: 10 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#13161B', borderColor: '#23272F', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Line type="monotone" dataKey="p95Latency" name="P95 Latency (ms)" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="errors" name="Error Rate (%)" stroke="#EF4444" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Terminal-Style Live Event Stream (Section 35) */}
      <div className="rounded-[14px] border border-[#23272F] bg-[#08090B] overflow-hidden">
        <div className="p-3.5 border-b border-[#23272F] bg-[#0F1115] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#9CA3AF]" />
            <span className="font-bold text-[#F5F7FA] uppercase">
              Live Event Stream (Section 35)
            </span>
          </div>
          <span className="text-[10px] text-[#10B981] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            Streaming
          </span>
        </div>

        <div className="p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5 leading-relaxed">
          {eventStream.map((evt, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[11px] hover:bg-[#0F1115] p-1 rounded transition-colors">
              <span className="text-[#6B7280] w-24 shrink-0">{evt.time}</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                evt.status === 'success' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' :
                evt.status === 'warning' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30' :
                'bg-indigo-950 text-indigo-300 border border-indigo-800'
              }`}>
                {evt.event}
              </span>
              <span className="text-indigo-400 font-bold">{evt.user}</span>
              <span className="text-[#9CA3AF] truncate">&rarr; {evt.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
