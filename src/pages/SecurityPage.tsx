import React from 'react';
import { Lock, Shield, Key, Eye, FileText, CheckCircle2, Server } from 'lucide-react';
import { CodeBlock } from '../components/common/CodeBlock';

export const SecurityPage: React.FC = () => {
  const securityLayers = [
    { num: '01', title: 'Network & Transport Security', tech: 'TLS 1.3 + Strict-Transport-Security', desc: 'All traffic encrypted end-to-end with TLS 1.3, perfect forward secrecy (PFS), and automated certificate rotation.' },
    { num: '02', title: 'Edge WAF & Scalper Shield', tech: 'AWS WAF + Cloudflare Bot Management', desc: 'Behavioral analysis blocking automated Puppeteer/Selenium scripts, volumetric SYN floods, and malicious IP ranges.' },
    { num: '03', title: 'Stateless Authentication', tech: 'Asymmetric JWT (RS256)', desc: 'Short-lived tokens (15-min expiry) signed with private keys. Public keys cached on Envoy API Gateway for zero-latency verification.' },
    { num: '04', title: 'Role-Based Access Control', tech: 'Fine-Grained RBAC & Scopes', desc: 'Strict separation of privileges: customer tokens restricted to their own reservations; warehouse roles cannot alter inventory balances.' },
    { num: '05', title: 'Webhook Verification', tech: 'HMAC-SHA256 Signature Validation', desc: 'Incoming Stripe and Adyen webhooks verified using secret signing keys to eliminate replay attacks and spoofed payment confirmations.' },
    { num: '06', title: 'Secrets Management', tech: 'HashiCorp Vault / AWS Secrets Manager', desc: 'Zero hard-coded credentials; automated rotation of database passwords and third-party API tokens with IAM role authentication.' },
    { num: '07', title: 'PII Encryption at Rest', tech: 'AES-256-GCM Column-Level Encryption', desc: 'Customer addresses and payment metadata encrypted with envelope keys before disk write, ensuring PCI-DSS compliance.' },
    { num: '08', title: 'Immutable Audit Logging', tech: 'Append-Only Database Audit Ledger', desc: 'Every balance decrement, payment intent, and state mutation logged with timestamp and user ID for legal financial reconciliation.' }
  ];

  const webhookVerifyCode = `// STRIPE WEBHOOK HMAC-SHA256 SIGNATURE VERIFICATION
export function verifyStripeWebhook(payload: Buffer, sigHeader: string, endpointSecret: string): Stripe.Event {
  try {
    // Verifies cryptographic timestamp and signature to prevent replay attacks
    const event = stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    return event;
  } catch (err: any) {
    throw new Error(\`Webhook signature verification failed: \${err.message}\`);
  }
}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold uppercase">
          <Lock className="w-3.5 h-3.5" />
          <span>Section 31: Defense-in-Depth</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Security & Anti-Fraud Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          The 8 layered security tiers protecting inventory integrity, customer privacy, payment webhooks, and administrative access during extreme traffic bursts.
        </p>
      </div>

      {/* Layered Security Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityLayers.map((layer) => (
          <div key={layer.num} className="p-5 rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold text-xs">
                {layer.num}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {layer.tech}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono">{layer.title}</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">{layer.desc}</p>
          </div>
        ))}
      </div>

      {/* Webhook HMAC Verification Code */}
      <CodeBlock
        title="HMAC-SHA256 Webhook Verification Implementation"
        language="typescript"
        code={webhookVerifyCode}
      />
    </div>
  );
};
