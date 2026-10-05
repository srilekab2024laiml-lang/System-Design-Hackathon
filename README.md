# SALESTORM — High-Scale E-Commerce Flash Sale System Design

> **10,000 Concurrent Customers. 100 Available Units. ZERO OVERSELLING.**

A production-grade, interactive distributed system design platform and engineering architecture dashboard built for presentation to hackathon judges.

---

## 1. Project Overview & Challenge Mandate

Flash sales represent the ultimate trial for high-concurrency distributed systems: massive instantaneous traffic surges ($10,000\text{ users at } T=0$), extreme contention on a scarce shared resource ($100\text{ units}$), external third-party payment network latencies, and zero business tolerance for overselling.

The core mathematical invariant of SALESTORM is:

$$\text{Successful Confirmed Sales} \le \text{Available Physical Inventory (100)}$$
$$\text{Available Inventory} \ge 0 \quad (\text{Never Negative})$$

---

## 2. Technology Stack

### Frontend & Visualizations
* **Framework**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS (Dark technical engineering aesthetic: `#090d16` canvas, slate-900 panels, cyan/emerald/amber/rose status accents)
* **Icons**: Lucide React
* **Charts & Telemetry**: Recharts (RPS curves, P95/P99 latency, queue depth, stock depletion)
* **Search & Navigation**: Built-in fuzzy index for `Cmd/Ctrl + K` global command palette

### Backend & Storage Architecture (Reference Model)
* **Authoritative Store**: PostgreSQL with ACID serializability, row-level locks, and strict constraints (`CHECK available_quantity >= 0`)
* **Connection Multiplexing**: PgBouncer in transaction pooling mode
* **Read Barrier & Rate Limiting**: Redis Cluster (Sliding window rate limiter & L2 read-hint cache)
* **Event Broker**: Apache Kafka (Durable partitioned event log with Dead Letter Queues)
* **Change Data Capture**: Debezium CDC for Transactional Outbox log streaming

---

## 3. Project Structure

```text
salestorm-system-design/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx                     # URL hash router & view switcher
    ├── index.css                   # Global dark theme & print stylesheets
    ├── types/                      # Comprehensive TypeScript domain interfaces
    ├── data/
    │   ├── architectureData.ts     # 15+ microservices & infrastructure components
    │   ├── requirementsData.ts     # Functional & Non-functional cards (Brief vs Assumptions)
    │   ├── databaseData.ts         # 12 ER tables, columns, indexes, check constraints
    │   ├── apiData.ts              # REST API explorer specs with Idempotency-Key
    │   ├── adrData.ts              # ADR-001 through ADR-006
    │   ├── tradeOffsData.ts        # SQL vs NoSQL, Redis vs DB authority, etc.
    │   ├── reliabilityData.ts      # 11 failure scenarios & circuit breaker matrix
    │   ├── juryQuestionsData.ts    # 16+ vetted answers for hackathon judges
    │   └── presentationData.ts     # 10 projector-ready presentation slides
    ├── components/
    │   ├── layout/                 # Persistent desktop sidebar & mobile drawer
    │   ├── search/                 # Ctrl+K global search modal
    │   ├── common/                 # MetricCard, CodeBlock, SourceBadge
    │   ├── architecture/           # Interactive topology & animated data flow runner
    │   ├── inventory/              # Concurrency demo (Safe atomic SQL vs Unsafe race bug)
    │   ├── reservation/            # State machine & real-time lease auto-release countdown
    │   ├── payment/                # 3 payment scenarios & Outbox order recovery simulator
    │   ├── order/                  # Order state machine
    │   ├── database/               # Interactive ER diagram & column inspector
    │   ├── apis/                   # API documentation explorer
    │   ├── idempotency/            # Client key deduplication playground
    │   ├── reliability/            # Failure matrix & interactive circuit breaker
    │   ├── observability/          # Telemetry charts (RPS, P95 latency, Kafka lag)
    │   ├── simulation/             # Deterministic 10,000-user simulation engine & log stream
    │   ├── presentation/           # Projector presentation deck with speaker notes
    │   └── export/                 # Mermaid, PlantUML, and Print export modal
    └── pages/                      # 20+ dedicated engineering pages
```

---

## 4. Key Architectural Decisions & Guarantees

### 1. Atomic Conditional Decrement (Zero Oversell)
Rather than executing naive `SELECT -> CHECK -> UPDATE` application logic, SALESTORM executes a single atomic conditional update in PostgreSQL:

```sql
UPDATE inventory
SET 
    available_quantity = available_quantity - :quantity,
    reserved_quantity  = reserved_quantity  + :quantity,
    version            = version + 1,
    updated_at         = CURRENT_TIMESTAMP
WHERE 
    product_id = :product_id 
    AND available_quantity >= :quantity;
```
Because the `WHERE available_quantity >= :quantity` condition is evaluated inside the database storage engine while holding an exclusive row lock on the product row, parallel transactions queue up and inspect the serial balance. Exactly 100 succeed; the remaining 9,900 return 0 affected rows and receive an instant `HTTP 409 OUT_OF_STOCK`.

### 2. Two-Phase Expiring Reservation Pattern
To prevent third-party payment gateway latency (1,000–3,000ms) from locking database connections, Phase 1 executes an 80ms reservation and grants a 5-minute lease (`RESERVED` state). If the customer abandons checkout, a background sweeper automatically releases the unit back to the available pool.

### 3. Transactional Outbox Pattern (Zero Lost Orders)
To eliminate the dual-write problem, the Payment Service commits both the payment record AND an `outbox_events` record in the **same local ACID database transaction**. If the Order Service or network is down during payment, the event remains safely stored on disk and Kafka buffers it until the consumer recovers.

### 4. End-to-End Idempotency
Mandatory client-supplied `Idempotency-Key` headers on all write endpoints ensure duplicate clicks or network retries are deduplicated, returning the original response without double-charging or double-allocating.

---

## 5. How to Run Locally

### Prerequisites
* Node.js v18+ (tested on Node v22.23.1)
* npm v9+

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```
Open your browser to `http://localhost:3000`.

### Production Build & Preview
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Verification Checklist & Demos

- [x] **Zero Oversell Guarantee**: 10,000 concurrent requests result in exactly 100 sales and 0 overselling.
- [x] **Safe vs Unsafe Concurrency Playground**: Visual demonstration of why naive read-check-write loses race conditions.
- [x] **Critical Outbox Failure Demo**: Simulates payment succeeding while the Order Service is down, buffering in Kafka, and recovering with zero lost orders.
- [x] **Live Reservation Timer**: 15s/300s countdown timer showing auto-expiry and stock release.
- [x] **Interactive Architecture**: Complete React Flow topology with component inspection drawers and step-by-step flow animation.
- [x] **Full Presentation Deck**: 10-slide deck with keyboard navigation (`<-`, `->`, `F`, `Esc`) and speaker notes.
- [x] **Global Command Search**: `Cmd/Ctrl + K` indexing all 20+ pages, 15+ services, 12 tables, and 16 jury questions.

---

## 7. Known Assumptions

1. **Sale Duration & Lease Window**: The flash sale reservation lease is assumed to be 300 seconds (5 minutes), providing sufficient time for card entry while preventing inventory stagnation.
2. **Catalog Scope**: Contention is concentrated on 1 scarce flash sale product (100 units). For catalog-wide flash sales, products are sharded across database instances via `product_id`.
3. **Fulfillment Decoupling**: Physical warehouse picking, packing, and courier label generation are assumed to be asynchronous downstream operations decoupled from user-facing checkout response time.

---

## 8. License
MIT License. Built for System Design Hackathons.
