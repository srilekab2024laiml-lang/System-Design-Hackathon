import React, { useState, useEffect } from 'react';
import { Search, X, Cpu, Database, Server, AlertTriangle, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import { architectureComponents } from '../../data/architectureData';
import { databaseTables } from '../../data/databaseData';
import { apiEndpoints } from '../../data/apiData';
import { failureScenarios } from '../../data/reliabilityData';
import { architectureDecisionRecords } from '../../data/adrData';
import { juryQuestions } from '../../data/juryQuestionsData';

interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  targetPage: string;
  icon: any;
}

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: string) => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open search
          const event = new CustomEvent('open-search');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable corpus
  const allItems: SearchResultItem[] = [
    // Pages
    { id: 'page-overview', title: 'System Overview & Hero', category: 'Navigation', subtitle: '10,000 customers, 100 units, Zero oversell', targetPage: 'overview', icon: Server },
    { id: 'page-problem', title: 'The Concurrency Problem & Invariant', category: 'Navigation', subtitle: 'Race conditions and mathematical guarantees', targetPage: 'problem', icon: AlertTriangle },
    { id: 'page-requirements', title: 'Functional & Non-Functional Requirements', category: 'Navigation', subtitle: 'Brief vs Assumptions mapping', targetPage: 'requirements', icon: FileText },
    { id: 'page-architecture', title: 'Interactive System Architecture', category: 'Navigation', subtitle: 'React Flow microservice topology and flow runner', targetPage: 'architecture', icon: Cpu },
    { id: 'page-inventory', title: 'Inventory Concurrency & Atomic Updates', category: 'Navigation', subtitle: 'Safe vs Unsafe race condition comparison', targetPage: 'inventory', icon: Database },
    { id: 'page-reservation', title: 'Reservation State Machine & Timer', category: 'Navigation', subtitle: '5-minute auto-expiry lease and rollback', targetPage: 'reservation', icon: FileText },
    { id: 'page-payment', title: 'Payment Reliability & Transactional Outbox', category: 'Navigation', subtitle: 'Order service outage recovery simulation', targetPage: 'payment', icon: Server },
    { id: 'page-order', title: 'Order Lifecycle & State Transitions', category: 'Navigation', subtitle: 'Idempotent creation and state machine', targetPage: 'order', icon: FileText },
    { id: 'page-database', title: 'Database ER Diagram & Schema Design', category: 'Navigation', subtitle: '12 tables, constraints, indexes', targetPage: 'database', icon: Database },
    { id: 'page-apis', title: 'API Specification Explorer', category: 'Navigation', subtitle: 'REST endpoints with Idempotency-Key headers', targetPage: 'apis', icon: Server },
    { id: 'page-simulation', title: 'Live Deterministic Flash Sale Simulation', category: 'Navigation', subtitle: 'Run 10,000 virtual customer flash sale', targetPage: 'simulation', icon: Cpu },
    { id: 'page-reliability', title: 'Reliability & Failure Matrix', category: 'Navigation', subtitle: '11 failure modes and circuit breakers', targetPage: 'reliability', icon: AlertTriangle },
    { id: 'page-observability', title: 'Telemetry & Observability Dashboard', category: 'Navigation', subtitle: 'RPS, P99 latency, Kafka lag, DLQ', targetPage: 'observability', icon: Server },
    { id: 'page-security', title: 'Security & Bot Protection', category: 'Navigation', subtitle: 'WAF, Turnstile CAPTCHA, HMAC webhooks', targetPage: 'security', icon: Server },
    { id: 'page-testing', title: 'Testing Strategy & Load Tests', category: 'Navigation', subtitle: 'Automated 10,000-user concurrency test runner', targetPage: 'testing', icon: FileText },
    { id: 'page-tradeoffs', title: 'Architectural Trade-offs Matrix', category: 'Navigation', subtitle: 'SQL vs NoSQL, Redis vs DB authority', targetPage: 'tradeoffs', icon: HelpCircle },
    { id: 'page-adrs', title: 'Architecture Decision Records (ADRs)', category: 'Navigation', subtitle: 'ADR-001 through ADR-006', targetPage: 'adrs', icon: FileText },
    { id: 'page-juryqa', title: 'Jury Q&A Defense Directory', category: 'Navigation', subtitle: '16+ vetted technical answers for judges', targetPage: 'juryqa', icon: HelpCircle },
    { id: 'page-presentation', title: 'Presentation Mode (10 Slides)', category: 'Navigation', subtitle: 'Projector optimized slide deck', targetPage: 'presentation', icon: Server },

    // Components
    ...architectureComponents.map(c => ({
      id: `comp-${c.id}`,
      title: c.name,
      category: 'Architecture Component',
      subtitle: c.responsibility,
      targetPage: 'architecture',
      icon: Cpu
    })),

    // Database Tables
    ...databaseTables.map(t => ({
      id: `db-${t.name}`,
      title: `Table: ${t.name}`,
      category: 'Database Table',
      subtitle: t.purpose,
      targetPage: 'database',
      icon: Database
    })),

    // APIs
    ...apiEndpoints.map(a => ({
      id: `api-${a.id}`,
      title: `${a.method} ${a.path}`,
      category: 'API Endpoint',
      subtitle: a.summary,
      targetPage: 'apis',
      icon: Server
    })),

    // Failure Scenarios
    ...failureScenarios.map(f => ({
      id: `fail-${f.id}`,
      title: `Failure: ${f.component}`,
      category: 'Reliability',
      subtitle: f.failure,
      targetPage: 'reliability',
      icon: AlertTriangle
    })),

    // ADRs
    ...architectureDecisionRecords.map(adr => ({
      id: `adr-${adr.id}`,
      title: `${adr.id}: ${adr.title}`,
      category: 'Architecture Decision',
      subtitle: adr.decision,
      targetPage: 'adrs',
      icon: FileText
    })),

    // Jury Questions
    ...juryQuestions.map(j => ({
      id: `jq-${j.id}`,
      title: j.question,
      category: 'Jury Q&A',
      subtitle: j.shortAnswer,
      targetPage: 'juryqa',
      icon: HelpCircle
    }))
  ];

  const filtered = query.trim() === ''
    ? allItems.slice(0, 10)
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 15);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search components, tables, APIs, ADRs, jury questions..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching architectural components, APIs, or questions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.targetPage);
                    onClose();
                  }}
                  className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/80 transition-all group border border-transparent hover:border-slate-700"
                >
                  <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-cyan-950/60 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↵</kbd> to select</span>
          </div>
          <span>SALESTORM Index</span>
        </div>
      </div>
    </div>
  );
};
