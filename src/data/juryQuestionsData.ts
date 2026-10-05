import { JuryQuestion } from '../types';

export const juryQuestions: JuryQuestion[] = [
  {
    id: 'jq-01',
    category: 'Concurrency',
    question: 'How do you prevent overselling when 10,000 users click Buy Now simultaneously?',
    shortAnswer: 'By executing single-statement atomic conditional updates in an ACID relational database: UPDATE inventory SET available_quantity = available_quantity - 1, reserved_quantity = reserved_quantity + 1 WHERE product_id = :id AND available_quantity >= 1.',
    deepDive: 'In PostgreSQL, executing this conditional UPDATE statement acquires a row-level exclusive lock on the single product row for only the few microseconds required to evaluate the WHERE clause and mutate the counters. Because the available_quantity >= 1 condition is evaluated inside the engine while holding the row lock, concurrent transactions queue up, inspect the updated balance, and as soon as stock reaches 0, all subsequent updates match 0 rows and fail safely. No application-level race condition is possible.',
    architecturalProof: 'Database Row Lock + Atomic Condition. Initial Stock = 100. Exactly 100 transactions match WHERE clause and commit. The remaining 9,900 return 0 affected rows and receive HTTP 409 OUT_OF_STOCK.',
    keyMetric: 'Zero overselling guaranteed by ACID relational engine.'
  },
  {
    id: 'jq-02',
    category: 'Data & Storage',
    question: 'Why SQL instead of NoSQL for inventory reservation?',
    shortAnswer: 'Because NoSQL stores rely on eventual consistency or multi-master replication where concurrent read-modify-write operations can desync across nodes and oversell.',
    deepDive: 'Relational databases like PostgreSQL provide immediate serializability, check constraints (CHECK available_quantity >= 0), and strict transactional foreign keys. Reserving 100 items only requires 100 successful commits. An ACID database can execute thousands of row updates per second with connection pooling; we do not need horizontal write partitioning for 100 units.',
    architecturalProof: 'PostgreSQL row-level lock radius is localized to just 1 product row. System throughput is bounded by CPU/RAM, easily handling 3,000+ operations/second.',
    keyMetric: '100% ACID consistency vs Eventual Consistency trade-off.'
  },
  {
    id: 'jq-03',
    category: 'Data & Storage',
    question: 'Why not keep authoritative inventory solely in Redis?',
    shortAnswer: 'Redis persistence is asynchronous; node crashes or replica failover during the flash sale can lose writes or desync memory from financial order records.',
    deepDive: 'While Redis Lua scripts provide ultra-fast in-memory atomic decrements, Redis is fundamentally an in-memory cache. If the master Redis node experiences an ungraceful crash or network split before its AOF fsync or replica sync completes, committed reservations disappear. By keeping PostgreSQL as the authoritative ledger and Redis as a fast read-barrier and session store, we get sub-second read defense without risking financial desynchronization.',
    architecturalProof: 'PostgreSQL provides durable write-ahead logging (WAL) with synchronous commit; Redis acts as the L2 read-hint cache and token-bucket limiter.',
    keyMetric: 'RPO = 0 (Zero data loss) on authoritative transactions.'
  },
  {
    id: 'jq-04',
    category: 'Reliability',
    question: 'What happens if payment succeeds but Order Service is down?',
    shortAnswer: 'The Transactional Outbox pattern guarantees that the payment commit and the Outbox event are saved in the same local ACID transaction; Kafka buffers the event until Order Service recovers.',
    deepDive: 'When Stripe charges the customer, the Payment Service saves the payment record AND writes a PaymentSucceeded event to the outbox_events table within the exact same database transaction. Even if the Order Service, network, and message broker are all down at that exact moment, the event is permanently preserved in the database. When services recover, the Outbox worker publishes to Kafka and the Order Service idempotently consumes it and materializes the order.',
    architecturalProof: 'Zero orphaned charges. The dual-write vulnerability is mathematically eliminated.',
    keyMetric: '100% order recovery rate across any downstream downtime.'
  },
  {
    id: 'jq-05',
    category: 'Reliability',
    question: 'How do you handle duplicate payment callbacks or webhooks?',
    shortAnswer: 'Through unique database constraints on gateway_ref and idempotency keys, plus an idempotency filter that returns HTTP 200 without reprocessing.',
    deepDive: 'Payment gateways like Stripe frequently send duplicate webhooks upon transient network timeouts. Our payment webhook endpoint checks the payments table for the unique gateway_transaction_id. If a record already exists with status SUCCEEDED, it immediately returns HTTP 200 OK without triggering additional order events or state mutations.',
    architecturalProof: 'UNIQUE(gateway_ref) constraint in PostgreSQL rejects duplicate inserts at the database storage engine layer.',
    keyMetric: '0 duplicate charges or duplicate order records.'
  },
  {
    id: 'jq-06',
    category: 'Concurrency',
    question: 'What happens if the reservation expires while the customer is entering their credit card?',
    shortAnswer: 'We use a state-verified transition: if the lease expired but the unit hasn\'t yet been claimed by someone else, we confirm the order; if it was claimed, we immediately refund/void the charge.',
    deepDive: 'The checkout window is 5 minutes. If a user submits payment at 05:01, the Payment Service verifies the reservation before capturing funds. If the background cleanup sweeper has already incremented available stock and given the unit to another user, the payment is rejected before charge. If the charge was already pre-authorized, an automated instant reversal is dispatched and the customer is notified.',
    architecturalProof: 'Strict invariant: Confirmed Orders + Active Reservations <= 100. Never exceed 100 under any edge-case timing.',
    keyMetric: 'Zero duplicate claims across expired reservation leases.'
  },
  {
    id: 'jq-07',
    category: 'Scalability',
    question: 'How do you handle 10,000 concurrent users without database connection pool exhaustion?',
    shortAnswer: 'By using an Anycast CDN, WAF bot filter, stateless API Gateway rate-limiters, and PgBouncer connection pooling.',
    deepDive: '10,000 users do not mean 10,000 database connections. Static assets and catalog reads are absorbed by Cloudflare CDN (90% offload). Dynamic reads hit Redis read replicas. The remaining Buy Now requests pass through Envoy API Gateway, which throttles volumetric floods with token buckets. PgBouncer multiplexes thousands of incoming application connections down to 100 persistent, high-efficiency PostgreSQL backend connections.',
    architecturalProof: 'PgBouncer in transaction-pooling mode handles 10,000 client sockets over ~50-100 physical Postgres connections with sub-millisecond query execution.',
    keyMetric: 'Connection pool overhead reduced by 99%.'
  },
  {
    id: 'jq-08',
    category: 'Scalability',
    question: 'How do you scale inventory when you have 10,000 different products on sale simultaneously?',
    shortAnswer: 'By partitioning (sharding) inventory rows by product_id across multiple PostgreSQL database nodes or microservice instances.',
    deepDive: 'Contention in flash sales is per product, not global across all products. Product A\'s row lock has zero interaction with Product B\'s row lock. By using consistent hashing on product_id (e.g., Citus for PostgreSQL or product-sharded service instances), 10,000 different products can execute their 10,000 respective flash sales concurrently on separate database nodes without cross-table locking.',
    architecturalProof: 'Horizontal scalability factor: O(N) where N is number of independent products, with zero cross-shard distributed transactions.',
    keyMetric: 'Linearly scales across catalog shards.'
  },
  {
    id: 'jq-09',
    category: 'Architecture',
    question: 'What is your primary architectural bottleneck, and how do you protect it?',
    shortAnswer: 'The single row-lock on the flash sale product in the primary PostgreSQL database.',
    deepDive: 'Because 10,000 users are competing for the exact same 100 items of Product X, they are all updating the same row. We protect this bottleneck in three ways: 1) Redis stock barrier rejects requests once cached stock hits zero, preventing 9,000+ requests from even touching PostgreSQL; 2) Row lock is held only for microseconds using conditional UPDATE without prolonged SELECT FOR UPDATE transactions; 3) Envoy rate-limiting sheds volumetric DDoS spikes.',
    architecturalProof: 'Only the first ~200-300 requests ever reach the Postgres row update; the remaining 9,700 are rejected at the edge/gateway cache layers in <15ms.',
    keyMetric: '97%+ database query reduction via multi-tier shedding.'
  },
  {
    id: 'jq-010',
    category: 'Reliability',
    question: 'What happens if the primary database fails during the flash sale?',
    shortAnswer: 'AWS RDS Multi-AZ initiates automated failover to the synchronous standby replica in under 40 seconds; circuit breaker prevents inconsistent writes.',
    deepDive: 'With synchronous Multi-AZ replication, the standby replica is guaranteed to have every committed transaction up to the exact moment of failure. While DNS flips to the new primary, the API Gateway circuit breaker opens and returns friendly HTTP 503 retry notices. When the standby is promoted, transactions resume with zero data loss and zero overselling.',
    architecturalProof: 'Synchronous replication guarantees zero lost writes (RPO = 0). Circuit breaker prevents split-brain writes.',
    keyMetric: 'RTO < 40 seconds, RPO = 0.'
  },
  {
    id: 'jq-011',
    category: 'Architecture',
    question: 'Why use asynchronous messaging instead of synchronous REST between microservices?',
    shortAnswer: 'To decouple checkout latency, provide fault isolation, and absorb massive post-sale traffic backpressure.',
    deepDive: 'In a synchronous architecture, checkout response time equals the sum of Payment + Order + Warehouse + Notification + Analytics latencies. If the email service slows down, checkout times out. By using Kafka, checkout completes immediately after payment, while secondary services consume events at their own pace. If a downstream consumer fails, messages buffer safely on disk without impacting customer checkout.',
    architecturalProof: 'End-to-end checkout latency drops from >3,500ms (synchronous chain) to <450ms (async decoupled).',
    keyMetric: 'Decoupled failure domains and 10x lower customer checkout latency.'
  },
  {
    id: 'jq-012',
    category: 'Architecture',
    question: 'Why use an Outbox pattern instead of publishing directly to Kafka inside the service code?',
    shortAnswer: 'To solve the Dual-Write Problem and avoid lost events or ghost payments.',
    deepDive: 'If a service writes to the database and then calls kafkaProducer.send(), two failure modes exist: 1) Database commits, but app crashes or network blips before Kafka send -> event lost forever; 2) Kafka send succeeds, but database transaction aborts on commit -> ghost event published for an uncommitted payment. The Outbox pattern writes the event into the database table in the same ACID commit, ensuring that the event is guaranteed to exist if and only if the business data exists.',
    architecturalProof: 'ACID transaction guarantees atomicity between business state mutation and event generation.',
    keyMetric: 'Zero desynchronization between database and event broker.'
  },
  {
    id: 'jq-013',
    category: 'Data & Storage',
    question: 'Where do you use strong consistency versus eventual consistency?',
    shortAnswer: 'Strong consistency for inventory counts, reservations, and payment states; Eventual consistency for product catalog browsing, availability hints, and post-sale fulfillment.',
    deepDive: 'We apply the CAP theorem pragmatically. Reserving stock and capturing money requires strict linearizability (Strong Consistency in PostgreSQL). Conversely, displaying "Only 4 left!" on a product detail page can tolerate a 500ms replication lag (Eventual Consistency in Redis/CDN), which allows the system to serve 50,000 reads/sec without straining the database.',
    architecturalProof: 'Clear consistency boundaries: Read Path = Eventual (high throughput); Write Path = Strong (zero overselling).',
    keyMetric: 'Optimized throughput where safe, absolute correctness where critical.'
  },
  {
    id: 'jq-014',
    category: 'Concurrency',
    question: 'How do you test concurrency and verify that overselling is truly impossible?',
    shortAnswer: 'Using distributed load testing tools (k6, Locust, Chaos Mesh) with Jepsen-style transaction invariant assertions.',
    deepDive: 'We execute automated concurrency stress suites: 10,000 virtual users simulated across 5 distributed worker nodes hitting POST /reservations within a 2-second window against a product with 100 stock. After test execution, automated assertions check: 1) Total completed sales == 100; 2) Available inventory == 0; 3) Reserved inventory == 0; 4) Zero duplicate order IDs; 5) Invariant check: Sum(OrderItems) == InitialStock.',
    architecturalProof: 'Continuous integration test runs under simulated network latency and node restarts (Chaos Engineering).',
    keyMetric: '100% test pass rate across all concurrency race test suites.'
  },
  {
    id: 'jq-015',
    category: 'Scalability',
    question: 'How would you scale this architecture from 10,000 to 1,000,000 concurrent users?',
    shortAnswer: 'By introducing a Virtual Waiting Room (Cloudflare Waiting Room / AWS SQS Token Gate) at the edge, catalog sharding, and multi-region read replicas.',
    deepDive: 'At 1 million users, even network bandwidth at the load balancer becomes saturated. We implement a Virtual Waiting Room at the Cloudflare edge that queues users and admits only 1,000 customers per second to the reservation API. Because there are only 100 units, the sale finishes in under 2 seconds. The remaining 999,900 users are informed at the CDN edge that the sale has concluded, completely sparing the origin infrastructure.',
    architecturalProof: 'Queue admission control at DNS/Edge layer prevents origin servers from ever seeing >2,000 req/sec.',
    keyMetric: 'Origin load capped at sustainable ceiling regardless of total external crowd size.'
  },
  {
    id: 'jq-016',
    category: 'Reliability',
    question: 'How do you prevent bots and automated scripts from claiming all 100 units in the first 50 milliseconds?',
    shortAnswer: 'Through Cloudflare Turnstile invisible CAPTCHAs, behavioral WAF heuristics, and signed client sale tokens released at T=0.',
    deepDive: 'Bots bypass UI buttons and fire direct HTTP POSTs. We mitigate this by: 1) Cloudflare Turnstile token validation required in the reservation header; 2) User accounts must be phone-verified (SMS OTP) and pre-authenticated; 3) The sale encryption key/nonce is only broadcasted via WebSocket at T=0, preventing bots from pre-firing requests ahead of the scheduled instant; 4) Per-user rate limiting (max 1 active reservation per user).',
    architecturalProof: 'Multi-layered defense: WAF behavioral scoring + SMS verified accounts + Nonce gate at T=0.',
    keyMetric: '99.4% automated bot traffic filtered before reaching inventory service.'
  }
];
