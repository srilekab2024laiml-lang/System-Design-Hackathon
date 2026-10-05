import { Requirement } from '../types';

export const requirements: Requirement[] = [
  // Functional Requirements
  {
    id: 'FR-01',
    title: 'Product Discovery & Availability Hint',
    category: 'functional',
    priority: 'P0 - Critical',
    description: 'Customers must be able to view the flash sale product page and inspect real-time availability status (In Stock vs Sold Out).',
    architecturalImplication: 'Read path must be heavily cached at CDN and Redis edge layers to protect authoritative inventory database from 10,000+ reads/sec.',
    source: 'brief'
  },
  {
    id: 'FR-02',
    title: 'High-Concurrency "Buy Now" Submission',
    category: 'functional',
    priority: 'P0 - Critical',
    description: '10,000 concurrent customers clicking "Buy Now" at the exact sale trigger instant (T=0) must be handled gracefully without HTTP 500 system crashes.',
    architecturalImplication: 'Stateless API layer with Envoy rate limiting and queuing backpressure, filtering requests to atomic reservation endpoints.',
    source: 'brief'
  },
  {
    id: 'FR-03',
    title: 'Authoritative Inventory Reservation',
    category: 'functional',
    priority: 'P0 - Critical',
    description: 'System must atomically allocate stock to the first 100 eligible customers and instantly reject subsequent requests when available count reaches zero.',
    architecturalImplication: 'Strongly consistent, ACID-compliant database update with row lock or conditional evaluation: WHERE available_quantity >= requested_quantity.',
    source: 'brief'
  },
  {
    id: 'FR-04',
    title: 'Temporary Reservation Expiry & Auto-Release',
    category: 'functional',
    priority: 'P0 - Critical',
    description: 'Reservations must expire automatically after a predefined window (e.g. 5 minutes) if payment is not completed, releasing inventory back to waiting users.',
    architecturalImplication: 'TTL-backed reservation records monitored by Redis keyspace notifications or durable scheduling workers that execute atomic rollback scripts.',
    source: 'brief'
  },
  {
    id: 'FR-05',
    title: 'Secure & Idempotent Checkout Payment',
    category: 'functional',
    priority: 'P0 - Critical',
    description: 'Customers with active reservations can initiate payment through third-party gateways with zero risk of duplicate billing.',
    architecturalImplication: 'Mandatory client-supplied Idempotency-Key header stored in durable storage before charging external payment gateway.',
    source: 'brief'
  },
  {
    id: 'FR-06',
    title: 'Guaranteed Order Creation upon Payment Success',
    category: 'functional',
    priority: 'P0 - Critical',
    description: 'Every captured payment must reliably materialize an immutable Order record, even if the Order Service is temporarily unreachable during the callback.',
    architecturalImplication: 'Transactional Outbox pattern coupled with durable message broker (Kafka) to decouple payment confirmation from order generation.',
    source: 'brief'
  },
  {
    id: 'FR-07',
    title: 'Duplicate Prevention & Double-Click Mitigation',
    category: 'functional',
    priority: 'P0 - Critical',
    description: 'Aggressive clicking or network retransmissions must not create multiple reservations or charges for the same user.',
    architecturalImplication: 'Unique database constraints on (user_id, sale_id) and Redis distributed request deduplication tokens with 30s TTL.',
    source: 'brief'
  },
  {
    id: 'FR-08',
    title: 'Shipment & Warehouse Fulfillment Dispatch',
    category: 'functional',
    priority: 'P1 - High',
    description: 'Confirmed orders must be batched and queued for warehouse picking, packing, and courier label generation.',
    architecturalImplication: 'Asynchronous event consumer listening to order.confirmed topic; isolated from user-facing transaction path.',
    source: 'assumption'
  },
  {
    id: 'FR-09',
    title: 'Real-Time Customer Comms & Receipt Dispatch',
    category: 'functional',
    priority: 'P2 - Medium',
    description: 'Customers receive instant confirmation via SMS and Email containing invoice details and estimated delivery date.',
    architecturalImplication: 'Event-driven notification worker with retry queues and circuit breakers to external communication providers (Twilio/SendGrid).',
    source: 'assumption'
  },

  // Non-Functional Requirements
  {
    id: 'NFR-01',
    title: 'Zero Oversell Guarantee (Strict Invariant)',
    category: 'non-functional',
    priority: 'P0 - Critical',
    description: 'Under no circumstances may the system confirm more than 100 sales. Successful Sales <= Available Inventory (100 units). Final available stock >= 0.',
    architecturalImplication: 'Strict consistency on inventory state; atomic decrements; single source of authoritative inventory truth in ACID database.',
    source: 'brief'
  },
  {
    id: 'NFR-02',
    title: 'High Availability & Surge Resilience',
    category: 'non-functional',
    priority: 'P0 - Critical',
    description: 'The user-facing storefront must maintain 99.99% availability during traffic spikes up to 10,000 concurrent requests at T=0.',
    architecturalImplication: 'Multi-AZ active-active deployment, CDN caching, auto-scaling API gateway, and backpressure rate limiters.',
    source: 'brief'
  },
  {
    id: 'NFR-03',
    title: 'Sub-Second Latency on Critical Paths',
    category: 'non-functional',
    priority: 'P1 - High',
    description: 'Reservation response latency must remain under 250ms (p95) and under 500ms (p99) to provide immediate feedback to competing customers.',
    architecturalImplication: 'Optimized SQL execution plans, lightweight JSON payloads, indexed product lookups, connection pooling (PgBouncer).',
    source: 'decision'
  },
  {
    id: 'NFR-04',
    title: 'Fault Isolation & Partition Tolerance',
    category: 'non-functional',
    priority: 'P0 - Critical',
    description: 'Outages in non-critical components (such as notification service, analytics, or warehouse dispatch) must not block customer checkout or inventory reservation.',
    architecturalImplication: 'Asynchronous event-driven messaging with Kafka topics and Dead-Letter-Queues (DLQ) separating synchronous checkout from asynchronous post-sale.',
    source: 'decision'
  },
  {
    id: 'NFR-05',
    title: 'Zero Lost Orders (Durable Financial Integrity)',
    category: 'non-functional',
    priority: 'P0 - Critical',
    description: 'If money has been deducted from a customer, an order must never be lost. Zero orphaned payments.',
    architecturalImplication: 'Transactional Outbox pattern: payment confirmation and event recording occur in the same ACID local database transaction.',
    source: 'brief'
  },
  {
    id: 'NFR-06',
    title: 'Defense-in-Depth Security & Anti-Bot Shielding',
    category: 'non-functional',
    priority: 'P1 - High',
    description: 'Protection against scalpers, automated browser bots, distributed denial-of-service (DDoS), and man-in-the-middle tampering.',
    architecturalImplication: 'WAF behavioral bot analysis, encrypted TLS 1.3, signed JWTs with short expiry, HMAC webhook signature verification, rate limiting.',
    source: 'decision'
  },
  {
    id: 'NFR-07',
    title: 'Comprehensive Observability & Traceability',
    category: 'non-functional',
    priority: 'P1 - High',
    description: 'Real-time telemetry showing live requests/sec, reservation success, error rates, queue depths, and distributed request tracing.',
    architecturalImplication: 'Prometheus metrics, Grafana dashboards, OpenTelemetry distributed trace IDs propagated via HTTP headers (W3C traceparent).',
    source: 'decision'
  },
  {
    id: 'NFR-08',
    title: 'Configurable Reservation Expiry TTL (5 Minutes)',
    category: 'non-functional',
    priority: 'P1 - High',
    description: 'Reservation checkout window is tuned to 300 seconds (5 minutes) to give human users ample time while preventing stock stagnation.',
    architecturalImplication: 'Redis TTL + distributed cron sweeps verifying reservation timestamp against CURRENT_TIMESTAMP.',
    source: 'assumption'
  }
];
