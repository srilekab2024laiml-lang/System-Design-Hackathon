import React, { useState, useEffect } from 'react';
import {
  Users,
  Globe,
  Shield,
  Layers,
  Cpu,
  Database,
  CreditCard,
  PackageCheck,
  Radio,
  Truck,
  Bell,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { architectureComponents } from '../../data/architectureData';
import { ArchitectureComponent } from '../../types';
import { ComponentDrawer } from './ComponentDrawer';

export const InteractiveDiagram: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent | null>(null);
  const [flowStep, setFlowStep] = useState<number | null>(null);
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);

  // Flow animation steps (Section 20)
  const flowSteps = [
    {
      step: 1,
      name: 'Customer Surge (T=0)',
      activeNodeId: 'users',
      label: '10,000 Concurrent Customers click "Buy Now"',
      state: 'INITIATED',
      tooltip: 'Flash burst hits edge DNS simultaneously.'
    },
    {
      step: 2,
      name: 'Edge CDN & WAF Filtering',
      activeNodeId: 'waf',
      label: 'Bot Mitigation & Rate Limiting',
      state: 'EDGE_INSPECTED',
      tooltip: 'Cloudflare absorbs 90%+ read traffic. WAF drops bots.'
    },
    {
      step: 3,
      name: 'API Gateway Ingress',
      activeNodeId: 'api-gateway',
      label: 'Envoy Token Bucket Throttling',
      state: 'GATEWAY_ADMITTED',
      tooltip: 'JWT token verified; client rate limiter admits burst.'
    },
    {
      step: 4,
      name: 'Checkout Orchestration',
      activeNodeId: 'checkout-service',
      label: 'Initiate Atomic Reservation',
      state: 'ORCHESTRATING',
      tooltip: 'Sends atomic reservation request with Idempotency-Key.'
    },
    {
      step: 5,
      name: 'Authoritative Inventory Lock',
      activeNodeId: 'inventory-service',
      label: 'Atomic SQL Conditional Update',
      state: 'ATOMIC_DECREMENT',
      tooltip: 'UPDATE inventory SET available = available - 1 WHERE available >= 1.'
    },
    {
      step: 6,
      name: 'Reservation Lease Granted',
      activeNodeId: 'inventory-service',
      label: '100 Win, 9,900 Rejected',
      state: 'RESERVED_300S',
      tooltip: '100 receive 5-minute lease (RESERVED); 9,900 get instant 409 OOS.'
    },
    {
      step: 7,
      name: 'Idempotent Payment Capture',
      activeNodeId: 'payment-service',
      label: 'Stripe Gateway + Transactional Outbox',
      state: 'PAYMENT_CAPTURED',
      tooltip: 'Card charged. Payment AND Outbox event committed in SAME transaction.'
    },
    {
      step: 8,
      name: 'Durable Message Bus Relay',
      activeNodeId: 'message-broker',
      label: 'Kafka "PaymentSucceeded" Topic',
      state: 'EVENT_BUFFERED',
      tooltip: 'Outbox CDC pushes to Kafka partition. Safely buffered on disk.'
    },
    {
      step: 9,
      name: 'Order Lifecycle Materialization',
      activeNodeId: 'order-service',
      label: 'Idempotent Order Insertion',
      state: 'ORDER_CONFIRMED',
      tooltip: 'Order Service consumes event and commits immutable Order ORD-XXXX.'
    },
    {
      step: 10,
      name: 'Asynchronous Fulfillment & Comms',
      activeNodeId: 'fulfillment-service',
      label: 'Warehouse Slip + SMS Receipt',
      state: 'FULFILLMENT_QUEUED',
      tooltip: 'Decoupled 3PL courier label generated without checkout delay.'
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingFlow) {
      timer = setInterval(() => {
        setFlowStep((prev) => {
          if (prev === null || prev >= flowSteps.length) {
            setIsPlayingFlow(false);
            return null;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlayingFlow]);

  const handleStartFlow = () => {
    setFlowStep(1);
    setIsPlayingFlow(true);
  };

  const handleResetFlow = () => {
    setIsPlayingFlow(false);
    setFlowStep(null);
  };

  const currentStepData = flowStep ? flowSteps[flowStep - 1] : null;

  const getComponentData = (id: string) => {
    return architectureComponents.find(c => c.id === id) || null;
  };

  // Render Infrastructure Component Node (Section 17 specification)
  const renderInfraNode = (
    id: string,
    title: string,
    responsibility: string,
    Icon: any,
    statusText: string = 'Healthy',
    statusColor: string = 'text-[#10B981]'
  ) => {
    const comp = getComponentData(id);
    const isStepActive = currentStepData?.activeNodeId === id;
    const isSelected = selectedComponent?.id === id;

    return (
      <div
        onClick={() => comp && setSelectedComponent(comp)}
        className={`relative cursor-pointer rounded-[12px] border p-4 text-left transition-all duration-200 ${
          isStepActive
            ? 'border-indigo-400 bg-[#13161B] ring-2 ring-indigo-500/40 shadow-lg'
            : isSelected
            ? 'border-[#10B981] bg-[#13161B] ring-1 ring-[#10B981]'
            : 'border-[#23272F] bg-[#0F1115] hover:border-[#323846] hover:bg-[#13161B]'
        }`}
      >
        {isStepActive && (
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-[4px] bg-[#6366F1] text-white font-mono font-bold text-[9px] uppercase tracking-wider animate-bounce shadow">
            Active In Flow
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#08090B] border border-[#23272F] text-indigo-400 shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-[#F5F7FA] font-mono tracking-tight truncate">
              {title}
            </h4>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-[#9CA3AF] line-clamp-1 font-sans">
          {responsibility}
        </div>

        <div className="mt-3 pt-2 border-t border-[#23272F] flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusColor === 'text-[#10B981]' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
            <span className={`${statusColor} font-semibold`}>{statusText}</span>
          </div>
          <span className="text-[#6B7280] hover:text-[#F5F7FA] flex items-center gap-0.5">
            Inspect <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="p-4 rounded-[14px] border border-[#23272F] bg-[#0F1115] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase text-indigo-400 block">
            Section 16 & 20: Architecture Explorer
          </span>
          <h3 className="text-sm font-bold text-[#F5F7FA] mt-0.5 font-sans">
            Interactive Topology & Request Flow Simulation
          </h3>
        </div>

        {/* Play Flow Controls */}
        <div className="flex items-center gap-2">
          {!isPlayingFlow && flowStep === null ? (
            <button
              onClick={handleStartFlow}
              className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-mono font-bold transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>PLAY REQUEST FLOW</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPlayingFlow(!isPlayingFlow)}
                className="px-3 py-1.5 rounded-[8px] bg-[#13161B] hover:bg-[#181C22] border border-[#23272F] text-xs font-mono text-[#F5F7FA] transition-colors"
              >
                {isPlayingFlow ? 'Pause Flow' : 'Resume'}
              </button>
              <button
                onClick={handleResetFlow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#13161B] hover:bg-[#181C22] border border-[#23272F] text-xs font-mono text-[#9CA3AF] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Step Context Tooltip Banner (Section 20) */}
      {currentStepData && (
        <div className="p-4 rounded-[12px] border border-indigo-500/40 bg-[#13161B] animate-fade-in flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-mono font-bold flex items-center justify-center text-xs shrink-0">
              {currentStepData.step}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-300">
                  Step {currentStepData.step} of 10: {currentStepData.name}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#08090B] text-indigo-300 border border-[#23272F]">
                  {currentStepData.state}
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5 font-sans">
                {currentStepData.label} &bull; <span className="text-[#F5F7FA]">{currentStepData.tooltip}</span>
              </p>
            </div>
          </div>
          <div className="text-[11px] font-mono text-indigo-400 shrink-0 hidden sm:block">
            {currentStepData.step * 10}%
          </div>
        </div>
      )}

      {/* Main Architecture Canvas (Section 16 & 17) */}
      <div className="rounded-[16px] border border-[#23272F] bg-[#08090B] p-6 sm:p-8 space-y-8 relative overflow-hidden">
        {/* Tier 1: Clients & Ingress */}
        <div>
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#6B7280] uppercase tracking-wider font-semibold">
            <span>Tier 1: Global Edge Ingress</span>
            <span>Anycast PoPs</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-[12px] border border-[#23272F] bg-[#0F1115] p-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#08090B] border border-[#23272F] text-blue-400">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold font-mono text-[#F5F7FA]">10,000 Customers</h4>
              </div>
              <div className="mt-2 text-[11px] text-[#9CA3AF]">Simultaneous Buy Now at T=0</div>
              <div className="mt-3 pt-2 border-t border-[#23272F] text-[10px] font-mono text-blue-400">
                Peak Load Inbound
              </div>
            </div>

            {renderInfraNode('cdn', 'Cloudflare CDN', 'Edge Caching & Static Offload', Globe)}
            {renderInfraNode('waf', 'WAF & Bot Shield', 'Rate Limiting & CAPTCHA', Shield)}
            {renderInfraNode('alb', 'Load Balancer (ALB)', 'L7 Routing & Health Checks', Layers)}
          </div>
        </div>

        {/* Semantic Connector */}
        <div className="flex justify-center -my-3">
          <div className="px-3 py-1 rounded-full bg-[#0F1115] border border-[#23272F] text-[10px] font-mono text-[#9CA3AF] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>Synchronous HTTPS / TLS 1.3</span>
          </div>
        </div>

        {/* Tier 2: API Gateway & Stateless Services */}
        <div>
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#6B7280] uppercase tracking-wider font-semibold">
            <span>Tier 2: Stateless Service Layer</span>
            <span>Horizontal Auto-scaling</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderInfraNode('api-gateway', 'Envoy API Gateway', 'Token Bucket Rate Limiting', Cpu)}
            {renderInfraNode('auth-service', 'Auth Service', 'JWT RS256 Verification', Shield)}
            {renderInfraNode('product-service', 'Product Service', 'Catalog & Flash Schedule', Layers)}
            {renderInfraNode('checkout-service', 'Checkout Orchestrator', 'Two-Phase Coordination', Cpu)}
          </div>
        </div>

        {/* Semantic Connector */}
        <div className="flex justify-center -my-3">
          <div className="px-3 py-1 rounded-full bg-[#0F1115] border border-[#23272F] text-[10px] font-mono text-[#10B981] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>Atomic Reservation Path (&lt;80ms)</span>
          </div>
        </div>

        {/* Tier 3: Authoritative Persistence Core */}
        <div>
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#10B981] uppercase tracking-wider font-semibold">
            <span>Tier 3: Authoritative Persistence & Payments (Zero Oversell Core)</span>
            <span>ACID Serializable</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInfraNode('inventory-service', 'Authoritative Inventory', 'Row Lock & Atomic Decrement', Database, 'Master (Active)', 'text-[#10B981]')}
            {renderInfraNode('payment-service', 'Payment Service', 'Idempotent Charge + Outbox', CreditCard, 'Stripe Gateway', 'text-amber-400')}
            {renderInfraNode('order-service', 'Order Lifecycle Service', 'Idempotent Order Creation', PackageCheck, 'Consumer Active', 'text-purple-400')}
          </div>
        </div>

        {/* Semantic Connector */}
        <div className="flex justify-center -my-3">
          <div className="px-3 py-1 rounded-full bg-[#0F1115] border border-[#23272F] text-[10px] font-mono text-purple-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Durable Asynchronous Event Bus (Kafka)</span>
          </div>
        </div>

        {/* Tier 4: Event-Driven Fulfillment */}
        <div>
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#6B7280] uppercase tracking-wider font-semibold">
            <span>Tier 4: Event-Driven Fulfillment & Comms</span>
            <span>Decoupled Workers</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderInfraNode('message-broker', 'Apache Kafka Cluster', 'Partitioned Event Log & DLQ', Radio)}
            {renderInfraNode('outbox-poller', 'Transactional Outbox', 'Guaranteed At-Least-Once Relay', Layers)}
            {renderInfraNode('fulfillment-service', 'Shipment & Warehouse', 'Courier Labels & Dock Packing', Truck)}
            {renderInfraNode('notification-service', 'Notification Service', 'SMS & Email Receipts', Bell)}
          </div>
        </div>
      </div>

      {/* Semantic Connection Legend (Section 18 specification) */}
      <div className="p-4 rounded-[12px] border border-[#23272F] bg-[#0F1115] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <span className="text-[10px] uppercase font-bold text-[#6B7280]">Connection Semantics Legend:</span>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#10B981]" />
            <span className="text-[#9CA3AF]">Solid Green = Synchronous Request Path</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] border-t-2 border-dashed border-purple-400" />
            <span className="text-[#9CA3AF]">Dashed Purple = Asynchronous Event</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#EF4444]" />
            <span className="text-[#9CA3AF]">Red = Circuit Breaker / Fail-Fast Path</span>
          </div>
        </div>
      </div>

      {/* Slide-over Service Inspector Drawer */}
      <ComponentDrawer
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
        onSelectDependency={(depId) => {
          const match = architectureComponents.find(c => c.name.toLowerCase().includes(depId.toLowerCase()) || c.id === depId);
          if (match) setSelectedComponent(match);
        }}
      />
    </div>
  );
};
