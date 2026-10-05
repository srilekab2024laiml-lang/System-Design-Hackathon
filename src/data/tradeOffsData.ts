import { TradeOffItem } from '../types';

export const tradeOffsData: TradeOffItem[] = [
  {
    id: 'trade-01',
    title: 'PostgreSQL (ACID RDBMS) vs Distributed NoSQL (Cassandra / DynamoDB)',
    decision: 'PostgreSQL for Authoritative Inventory, Payments, and Orders',
    alternative: 'DynamoDB / Apache Cassandra',
    whyChosen: 'The core business mandate is absolute zero oversell across 100 units. PostgreSQL provides rigorous ACID serializability, multi-statement row locking, check constraints (`CHECK available_quantity >= 0`), and unique index guarantees.',
    benefit: 'Mathematical impossibility of negative stock balances. Clean foreign-key referential integrity between reservations, payments, and orders.',
    tradeOff: 'Write operations are pinned to a single primary database node. However, reserving 100 items takes only 100 successful atomic commits (~30ms total database engine time under row locking), so horizontal write partitioning across databases is unnecessary and introduces massive distributed transaction overhead.'
  },
  {
    id: 'trade-02',
    title: 'Database Authoritative State vs Redis In-Memory Authority',
    decision: 'PostgreSQL as Authoritative Master, Redis as Read Barrier & Session Store',
    alternative: 'Redis Lua `DECRBY` as the primary authoritative inventory ledger',
    whyChosen: 'While Redis in-memory Lua decrement executes in sub-millisecond time, Redis persistence (AOF/RDB) is asynchronous. If the Redis primary crashes or failover occurs during the 10-second sale window, writes can be lost, desyncing memory from financial banking orders.',
    benefit: 'Durable financial audit trail; zero data loss on node crash; transactions link directly to financial payment IDs.',
    tradeOff: 'Slightly higher database disk I/O latency (5ms vs 0.5ms) for the atomic reservation update. We offset this by using Redis as a fast front-door gate that rejects incoming traffic once cached stock hits zero.'
  },
  {
    id: 'trade-03',
    title: 'Two-Phase Reservation (Lease) vs Immediate Checkout Charge',
    decision: 'Two-Phase Reservation with 5-Minute Auto-Expiry Lease',
    alternative: 'Immediate Synchronous Credit Card Charge on "Buy Now" Click',
    whyChosen: 'External payment gateways (Stripe/Adyen/Visa) require 1,000–3,000ms round-trip latency. Holding an open database transaction across 10,000 concurrent users for 3 seconds would exhaust database connection pools immediately and bring down the entire server.',
    benefit: 'Inventory reservation completes in <80ms; user is guaranteed their item and given a calm 5-minute window to enter CVV/OTP; connection pools remain idle and healthy.',
    tradeOff: 'Requires managing reservation lifecycles, timer expirations, and background inventory return sweeps if payments are abandoned.'
  },
  {
    id: 'trade-04',
    title: 'Synchronous Reservation + Asynchronous Post-Payment Pipeline',
    decision: 'Synchronous API for Buy Now & Payment; Asynchronous Messaging for Orders & Fulfillment',
    alternative: '100% Synchronous Request Chain (Checkout -> Payment -> Order -> Warehouse -> Email)',
    whyChosen: 'The customer only needs to know two critical answers synchronously: "Did I get a reservation?" and "Did my payment succeed?". Fulfillment, tracking numbers, and email receipts can occur seconds later without holding HTTP threads.',
    benefit: 'Total checkout latency drops from >4,000ms to <500ms. If warehouse ERP or email provider crashes, order checkout continues unaffected.',
    tradeOff: 'Customer UI briefly displays "Order Confirmed - Processing details" while background worker inserts the final order and shipping slip.'
  },
  {
    id: 'trade-05',
    title: 'Strong Consistency vs Eventual Consistency Boundaries',
    decision: 'Strong Consistency for Inventory & Payments; Eventual Consistency for Analytics, Catalogs, & Stock Hints',
    alternative: 'Global Strong Consistency everywhere OR Global Eventual Consistency everywhere',
    whyChosen: 'System design requires applying CAP theorem pragmatically. Applying strong consistency to product descriptions or live stock counters chokes the database. Applying eventual consistency to the reservation decrement causes overselling.',
    benefit: 'Maximizes throughput on 99% of requests (catalog reads, UI hints) while applying strict ACID locks only on the 100 critical reservation writes.',
    tradeOff: 'UI stock counter might display "Few Left" for a split second after the last unit is claimed until the edge cache revalidates.'
  },
  {
    id: 'trade-06',
    title: 'Transactional Outbox + Kafka vs Direct Microservice RPC (gRPC / HTTP)',
    decision: 'Transactional Outbox with Apache Kafka for Cross-Service Events',
    alternative: 'Direct gRPC calls from Payment Service to Order Service',
    whyChosen: 'Solves the Dual-Write failure scenario: if payment succeeds but the network blips before the Order Service RPC finishes, the customer is billed with no order created. Outbox guarantees atomic persistence of payment AND outbox message.',
    benefit: 'Zero lost orders. Guaranteed at-least-once delivery. Resilient to arbitrary downstream service crashes and maintenance deployments.',
    tradeOff: 'Requires maintaining an outbox poller/CDC worker and ensuring consumer operations are idempotent.'
  }
];
