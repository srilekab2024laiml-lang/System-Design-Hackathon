export type SourceType = 'brief' | 'decision' | 'assumption' | 'simulation';

export interface ArchitectureComponent {
  id: string;
  name: string;
  category: 'edge' | 'gateway' | 'service' | 'data' | 'queue' | 'async';
  responsibility: string;
  dataOwned: string;
  apis: string[];
  scalingStrategy: string;
  failureBehavior: string;
  whyItExists: string;
  dependencies: string[];
  techStack: string;
  throughputEst: string;
  source: SourceType;
}

export interface Requirement {
  id: string;
  title: string;
  category: 'functional' | 'non-functional';
  priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium';
  description: string;
  architecturalImplication: string;
  source: SourceType;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
  isUnique?: boolean;
  nullable?: boolean;
  description: string;
}

export interface DatabaseTable {
  name: string;
  purpose: string;
  columns: DatabaseColumn[];
  indexes: string[];
  constraints: string[];
  partitioning?: string;
  criticalInvariant: string;
}

export interface ApiEndpoint {
  id: string;
  group: 'Product' | 'Reservation' | 'Checkout' | 'Payment' | 'Orders';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  idempotent: boolean;
  idempotencyHeaderRequired: boolean;
  requestHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody: string;
  statusCodes: { code: number; description: string }[];
  failureCases: string[];
  latencyTarget: string;
}

export interface FailureScenario {
  id: string;
  component: string;
  failure: string;
  detection: string;
  behavior: string;
  recovery: string;
  finalState: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface ADR {
  id: string;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Superseded';
  context: string;
  decision: string;
  alternatives: { option: string; pros: string; cons: string }[];
  reason: string;
  consequences: string;
  source: SourceType;
}

export interface JuryQuestion {
  id: string;
  question: string;
  category: 'Concurrency' | 'Data & Storage' | 'Reliability' | 'Scalability' | 'Architecture';
  shortAnswer: string;
  deepDive: string;
  architecturalProof: string;
  keyMetric: string;
}

export interface TradeOffItem {
  id: string;
  title: string;
  decision: string;
  alternative: string;
  whyChosen: string;
  benefit: string;
  tradeOff: string;
}

export interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  takeaway: string;
  bullets: string[];
  metrics?: { label: string; value: string; hint?: string }[];
  codeOrDiagram?: string;
  speakerNotes: string;
}
