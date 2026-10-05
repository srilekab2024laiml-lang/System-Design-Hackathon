import React from 'react';
import { Cpu, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { IdempotencyDemo } from '../components/idempotency/IdempotencyDemo';
import { CodeBlock } from '../components/common/CodeBlock';

export const IdempotencyPage: React.FC = () => {
  const idempotencyFilterCode = `// API GATEWAY IDEMPOTENCY MIDDLEWARE (TypeScript)
export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['idempotency-key'] as string;
  if (!key) {
    return res.status(400).json({ error: 'MISSING_IDEMPOTENCY_KEY_HEADER' });
  }

  // 1. Check in fast Redis cache / PostgreSQL table
  const record = await db.query('SELECT status, response_body, response_status FROM idempotency_records WHERE key = $1', [key]);

  if (record.rows.length > 0) {
    const existing = record.rows[0];
    if (existing.status === 'PROCESSING') {
      // Parallel collision in flight
      return res.status(409).json({ error: 'CONCURRENT_REQUEST_IN_FLIGHT' });
    }
    // Replay original cached response with zero duplicate charge
    return res.status(existing.response_status).json(existing.response_body);
  }

  // 2. Insert key with PROCESSING status
  await db.query('INSERT INTO idempotency_records (key, user_id, status) VALUES ($1, $2, $3)', [key, req.user.id, 'PROCESSING']);

  next();
}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Cpu className="w-3.5 h-3.5" />
          <span>Section 23: Write Correctness</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Idempotency Architecture & Deduplication
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          How client-generated UUID keys prevent double billing, duplicate reservations, and accidental order duplication across aggressive button spamming and network retransmissions.
        </p>
      </div>

      {/* Interactive Idempotency Demo */}
      <IdempotencyDemo />

      {/* Middleware Pattern Code */}
      <CodeBlock
        title="Gateway Idempotency Middleware Pattern"
        language="typescript"
        code={idempotencyFilterCode}
      />
    </div>
  );
};
