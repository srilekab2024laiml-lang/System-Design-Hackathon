import React, { useState } from 'react';
import { X, Download, Printer, Copy, Check, FileCode } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mermaid' | 'plantuml' | 'summary'>('mermaid');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mermaidArchitecture = `graph TD
    User["10,000 Concurrent Customers"] --> CDN["Cloudflare Edge CDN"]
    CDN --> WAF["WAF & Anti-Bot Shield"]
    WAF --> ALB["Application Load Balancer"]
    ALB --> Gateway["Envoy API Gateway (Rate Limiter / Auth)"]
    
    Gateway --> ProductSvc["Product Catalog Service"]
    Gateway --> CheckoutSvc["Checkout Orchestrator"]
    
    CheckoutSvc --> InventorySvc["Authoritative Inventory Service"]
    InventorySvc --> PostgresDB[("PostgreSQL Master (Row Locking)")]
    InventorySvc --> RedisCache[("Redis Stock Barrier & TTL Store")]
    
    CheckoutSvc --> PaymentSvc["Payment Service (Idempotent)"]
    PaymentSvc --> Stripe["Stripe / External Gateway"]
    PaymentSvc --> Outbox[("Transactional Outbox")]
    
    Outbox --> Kafka["Apache Kafka Event Bus"]
    Kafka --> OrderSvc["Order Service (Idempotent Consumer)"]
    OrderSvc --> OrderDB[("Orders Database")]
    
    Kafka --> FulfillmentSvc["Warehouse & Shipment Service"]
    Kafka --> NotificationSvc["SMS & Email Notifications"]`;

  const plantUmlArchitecture = `@startuml
skinparam monochrome true
actor "10,000 Customers" as User
boundary "Cloudflare CDN / WAF" as Edge
control "API Gateway" as GW
control "Inventory Service" as InvSvc
database "PostgreSQL (Master)" as PG
control "Payment Service" as PaySvc
queue "Kafka Event Broker" as Kafka
control "Order Service" as OrdSvc

User -> Edge: Buy Now (T=0)
Edge -> GW: Filtered Inbound Traffic
GW -> InvSvc: POST /reservations
InvSvc -> PG: Atomic UPDATE inventory\\nWHERE available >= 1
PG --> InvSvc: 100 OK, 9900 OOS
InvSvc --> User: Reservation Granted (300s lease)

User -> PaySvc: POST /payments/charge
PaySvc -> PG: Commit Payment + Outbox Event
PaySvc -> Kafka: Publish PaymentSucceeded
Kafka -> OrdSvc: Consume Event
OrdSvc -> PG: Insert Order ORD-XXXX
@enduml`;

  const solutionSummaryText = `# SALESTORM: High-Scale E-Commerce Flash Sale Architecture Summary

Core Invariant: Successful Sales <= Available Inventory (10,000 concurrent customers competing for 100 units with ZERO OVERSELL)

1. Edge Defense: Cloudflare Anycast CDN & WAF absorb 90%+ read traffic and filter automated scalper bots.
2. Rate Limiting: Envoy API Gateway token bucket limits requests per user and throttles volumetric floods.
3. Authoritative Inventory: PostgreSQL database with atomic conditional update (UPDATE inventory SET available = available - 1 WHERE available >= 1). Row lock radius is limited to microseconds.
4. Two-Phase Expiring Reservation: 5-minute checkout lease gives customers calm payment UX without locking database rows during 3-second bank processing.
5. End-to-End Idempotency: Mandatory client Idempotency-Key headers prevent double charges and duplicate reservations.
6. Transactional Outbox: Payment confirmation and Outbox event are committed in the same local ACID transaction; Kafka buffers events if Order Service is down. Zero lost orders.
7. Asynchronous Post-Sale Decoupling: Kafka event bus isolates email receipts, warehouse fulfillment, and analytics from checkout latency.`;

  const getExportContent = () => {
    switch (activeTab) {
      case 'mermaid':
        return mermaidArchitecture;
      case 'plantuml':
        return plantUmlArchitecture;
      case 'summary':
        return solutionSummaryText;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'mermaid' ? 'mmd' : activeTab === 'plantuml' ? 'puml' : 'md';
    const blob = new Blob([getExportContent()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salestorm-architecture.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white text-base">Export System Architecture</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('mermaid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'mermaid' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mermaid Diagram
            </button>
            <button
              onClick={() => setActiveTab('plantuml')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'plantuml' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              PlantUML
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'summary' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Architecture Spec (MD)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Page</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-slate-200 bg-[#090d16] flex-1 whitespace-pre leading-relaxed select-all">
          {getExportContent()}
        </div>
      </div>
    </div>
  );
};
