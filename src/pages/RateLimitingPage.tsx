import React from 'react';
import { Shield, Lock, Cpu, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { CodeBlock } from '../components/common/CodeBlock';

export const RateLimitingPage: React.FC = () => {
  const tokenBucketLua = `-- REDIS TOKEN BUCKET RATE LIMITER (Executed at API Gateway)
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or '0')

if current + 1 > limit then
    return 0 -- REJECT with HTTP 429
else
    redis.call('incrby', key, 1)
    if current == 0 then
        redis.call('expire', key, 60) -- 60s sliding window
    end
    return 1 -- ADMIT REQUEST
end`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Section 27: Ingress Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Bot Defense & Rate Limiting Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          How to protect the scarce 100 inventory units from automated scalper scripts, volumetric DDoS floods, and aggressive clicking.
        </p>
      </div>

      {/* Layered Ingress Funnel */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
          Four-Layer Defense Ingress Topology
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-cyan-400 font-bold block text-[10px] uppercase">Layer 1: Edge WAF</span>
            <div className="text-white font-bold text-sm">Cloudflare WAF</div>
            <p className="text-slate-400 font-sans text-xs">
              Filters known malicious IP ranges, Tor exit nodes, and automated headless Selenium/Puppeteer browser scrapers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">Layer 2: Anti-Bot Challenge</span>
            <div className="text-white font-bold text-sm">Cloudflare Turnstile</div>
            <p className="text-slate-400 font-sans text-xs">
              Invisible cryptographic browser challenge validating human interaction at the "Buy Now" button.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-emerald-400 font-bold block text-[10px] uppercase">Layer 3: Rate Limiter</span>
            <div className="text-white font-bold text-sm">Redis Sliding Window</div>
            <p className="text-slate-400 font-sans text-xs">
              Caps requests to 5 per minute per authenticated user and 20 per minute per public IP subnet.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-purple-400 font-bold block text-[10px] uppercase">Layer 4: Sale Nonce Gate</span>
            <div className="text-white font-bold text-sm">T=0 Cryptographic Nonce</div>
            <p className="text-slate-400 font-sans text-xs">
              Sale validation key is broadcasted via WebSocket strictly at 12:00:00Z, preventing bots from pre-firing requests.
            </p>
          </div>
        </div>
      </div>

      {/* Redis Rate Limiter Script */}
      <CodeBlock
        title="Redis Sliding Window Rate Limiting Lua Script"
        language="lua"
        code={tokenBucketLua}
      />
    </div>
  );
};
