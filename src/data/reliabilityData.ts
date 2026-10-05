import { FailureScenario } from '../types';

export const failureScenarios: FailureScenario[] = [
  {
    id: 'fail-01',
    component: 'Authoritative Inventory DB',
    failure: 'Primary PostgreSQL node encounters hardware fault or connection saturation during flash sale spike.',
    detection: 'TCP health probes fail; connection pooler (PgBouncer) returns connection refused or query timeout > 1000ms.',
    behavior: 'API Gateway triggers Circuit Breaker to OPEN state. Inbound reservation requests fast-fail with HTTP 503 ("Flash sale high demand, please retry"). No unverified reservations permitted.',
    recovery: 'AWS RDS Multi-AZ automated failover promotes hot standby replica to primary (<40 seconds). DNS flips. PgBouncer reconnects and circuit resets to HALF-OPEN.',
    finalState: 'Zero overselling. Inventory count preserved exactly as committed prior to failover.',
    severity: 'CRITICAL'
  },
  {
    id: 'fail-02',
    component: 'External Payment Gateway',
    failure: 'Third-party payment processor (Stripe/Adyen) experiences 5xx errors or network timeout (>5 seconds).',
    detection: 'HTTP 502/504 status codes or client-side timeout in Payment Service gateway adapter.',
    behavior: 'Payment state marked as `TIMED_OUT` (NOT failed). Reservation is NOT immediately released to prevent charging customer without securing their goods.',
    recovery: 'Payment Service executes automated out-of-band status query (`GET /v1/charges?idempotency_key=...`) to determine if funds were actually captured. If captured, marks SUCCEEDED. If not, retries or safely voids.',
    finalState: 'Zero orphaned charges; customer either gets valid order or clean notification to retry CVV.',
    severity: 'HIGH'
  },
  {
    id: 'fail-03',
    component: 'Order Service Outage',
    failure: 'Order Service instances crash or encounter deployment rollout failure while customers are actively paying.',
    detection: 'Order Service pods fail Kubernetes readiness probes; HTTP 503 on internal RPC.',
    behavior: 'Payment succeeds and records event in local PostgreSQL `outbox_events` table. Outbox worker pushes message to Kafka topic `payment.succeeded`. Kafka safely buffers messages on disk.',
    recovery: 'When Order Service pods restart and report healthy, Kafka consumer group resumes consuming from last committed offset and materializes missing orders idempotently.',
    finalState: '100% order creation guarantee. Zero lost revenue or lost orders.',
    severity: 'CRITICAL'
  },
  {
    id: 'fail-04',
    component: 'Customer Cart / Payment Abandonment',
    failure: 'Customer wins 1 of the 100 reservations, enters checkout, but closes browser tab or walks away.',
    detection: 'Reservation record expires: `expires_at < CURRENT_TIMESTAMP` and status remains `PAYMENT_PENDING`.',
    behavior: 'TTL sweeper daemon or Redis expiration webhook triggers `RELEASE_RESERVATION` transaction.',
    recovery: 'Inventory table atomically increments: `UPDATE inventory SET available = available + 1, reserved = reserved - 1`. Unit becomes immediately available for the next customer in queue.',
    finalState: 'Stock never stays trapped in abandoned carts. 100% of physical units are successfully sold.',
    severity: 'MEDIUM'
  },
  {
    id: 'fail-05',
    component: 'Redis In-Memory Cache Crash',
    failure: 'Redis cluster node suffers OOM kill or master failure.',
    detection: 'Redis client driver emits `ConnectionRefusedException` or ping timeout > 100ms.',
    behavior: 'Inventory Service bypasses Redis read-barrier and falls back directly to PostgreSQL row query with adaptive rate limiting.',
    recovery: 'Redis Sentinel / Sentinel / AWS ElastiCache promotes replica. Cache warm-up script repopulates product catalog keys from PostgreSQL read replicas.',
    finalState: 'Slightly higher p99 latency during warm-up; zero impact on data consistency or stock counts.',
    severity: 'MEDIUM'
  },
  {
    id: 'fail-06',
    component: 'Kafka Message Broker Partition Failure',
    failure: 'One Kafka broker disk fills or network partition isolates broker 2 of 3.',
    detection: 'Kafka producer `NotEnoughReplicasException` or metadata refresh warning.',
    behavior: 'Transactional Outbox worker keeps events stored safely in PostgreSQL `outbox_events` table with status `PENDING`. No messages are discarded.',
    recovery: 'Once Kafka cluster reaches in-sync replica consensus (`min.insync.replicas=2`), outbox worker drains pending backlog in FIFO order.',
    finalState: 'Zero lost events. Post-checkout operations slightly delayed but fully reconciled.',
    severity: 'HIGH'
  },
  {
    id: 'fail-07',
    component: 'Duplicate Payment Webhook Delivery',
    failure: 'Payment processor sends 3 consecutive identical `payment_intent.succeeded` webhooks due to network packet replay.',
    detection: 'Incoming webhook contains identical `event_id` and `gateway_ref`.',
    behavior: 'Payment webhook handler queries `payments` table for matching `gateway_ref`. Finds existing record with status `SUCCEEDED`.',
    recovery: 'Handler immediately logs duplicate notice, ignores duplicate balance processing, and returns HTTP 200 OK to satisfy webhook provider.',
    finalState: 'Zero double-crediting, zero duplicate orders.',
    severity: 'MEDIUM'
  },
  {
    id: 'fail-08',
    component: 'Aggressive Customer Double-Clicking',
    failure: 'Desperate customer spams "Buy Now" button 15 times within 400 milliseconds.',
    detection: 'API Gateway observes identical Authorization token + `Idempotency-Key` within 10-second window.',
    behavior: 'First request proceeds to reservation engine. Requests 2–15 hit the active idempotency mutex lock in Redis and wait or receive the identical reservation token.',
    recovery: 'Only 1 unit is reserved. Subsequent calls return HTTP 200 with the already existing reservation ID.',
    finalState: 'Customer gets exactly 1 unit; other customers are not deprived of inventory.',
    severity: 'MEDIUM'
  },
  {
    id: 'fail-09',
    component: 'Notification & Comms Service Down',
    failure: 'Twilio SMS / SendGrid email API rate-limits or suffers global downtime.',
    detection: 'Notification worker catches HTTP 429/500 from third-party vendor.',
    behavior: 'Events moved to dead-letter retry topic with exponential backoff (1m, 5m, 15m). Core checkout pipeline is completely isolated.',
    recovery: 'Automated retry worker flushes messages once third-party provider stabilizes. Customer order and reservation remain 100% valid.',
    finalState: 'Confirmation receipt delivery delayed by several minutes; zero business transaction degradation.',
    severity: 'MEDIUM'
  },
  {
    id: 'fail-10',
    component: 'API Gateway Pod Scalability Saturation',
    failure: 'Inbound volumetric surge exceeds container CPU allocation before autoscaler completes pod launch.',
    detection: 'CPU utilization exceeds 90%; Envoy active connection queue spikes.',
    behavior: 'Token-bucket rate limiter rejects excess non-reservation requests with HTTP 429 Too Many Requests and `Retry-After: 3`. Priority queue protects in-flight checkout sessions.',
    recovery: 'Horizontal Pod Autoscaler (HPA) completes pod scaling from 4 to 20 replicas in under 45 seconds.',
    finalState: 'Server resources protected against cascade collapse; critical reservations continue processing.',
    severity: 'HIGH'
  },
  {
    id: 'fail-11',
    component: 'Reservation Expiry During In-Flight Payment',
    failure: 'Customer enters credit card at 04:59 of their 5:00 lease. Payment gateway takes 3 seconds, so payment finishes at 05:02 when lease technically expired.',
    detection: 'Payment Service checks reservation status right before confirming payment; detects status is `PAYMENT_PENDING` with lease expired by 2 seconds.',
    behavior: 'Optimistic lock grace window: If reservation sweeper has NOT yet reallocated the stock, status is immediately updated to `CONFIRMED`. If the sweeper already reallocated the stock to someone else, payment is automatically voided/refunded instantly and user notified.',
    recovery: 'Customer either receives confirmed order if unallocated, or clean auto-refund if stock was recaptured.',
    finalState: 'Invariant `Successful Sales <= Available Inventory (100)` is strictly preserved.',
    severity: 'CRITICAL'
  }
];
