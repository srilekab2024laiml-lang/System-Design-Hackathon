import { DatabaseTable } from '../types';

export const databaseTables: DatabaseTable[] = [
  {
    name: 'inventory',
    purpose: 'Authoritative single source of truth for stock quantities per product. Enforces atomic reservations and prevents overselling.',
    columns: [
      { name: 'product_id', type: 'UUID', isPk: true, description: 'Unique identifier of the flash sale product' },
      { name: 'total_quantity', type: 'INT', nullable: false, description: 'Initial configured stock (e.g. 100 units)' },
      { name: 'available_quantity', type: 'INT', nullable: false, description: 'Current unreserved stock available for sale (>= 0)' },
      { name: 'reserved_quantity', type: 'INT', nullable: false, description: 'Stock temporarily held in active checkouts' },
      { name: 'sold_quantity', type: 'INT', nullable: false, description: 'Stock definitively paid for and confirmed' },
      { name: 'version', type: 'BIGINT', nullable: false, description: 'Optimistic locking concurrency counter' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Record initialization timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Timestamp of last atomic mutation' }
    ],
    indexes: [
      'PRIMARY KEY (product_id)',
      'INDEX idx_inventory_product_stock (product_id, available_quantity)'
    ],
    constraints: [
      'CHECK (available_quantity >= 0)',
      'CHECK (reserved_quantity >= 0)',
      'CHECK (sold_quantity >= 0)',
      'CHECK (available_quantity + reserved_quantity + sold_quantity = total_quantity)'
    ],
    criticalInvariant: 'available_quantity >= 0 at all times. Sum of (available + reserved + sold) MUST strictly equal total_quantity.'
  },
  {
    name: 'reservations',
    purpose: 'Tracks temporary locks on inventory allocated to a specific customer session before payment confirmation.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Unique reservation reference token' },
      { name: 'product_id', type: 'UUID', isFk: true, fkRef: 'inventory.product_id', description: 'Product being reserved' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', description: 'Customer holding the reservation lock' },
      { name: 'quantity', type: 'INT', nullable: false, description: 'Quantity held (typically 1 for flash sales)' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'RESERVED | PAYMENT_PENDING | CONFIRMED | EXPIRED | RELEASED' },
      { name: 'expires_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Strict expiration timestamp (e.g. NOW() + 5 mins)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Time reservation was granted' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Time status last changed' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'UNIQUE (product_id, user_id, status) WHERE status IN (\'RESERVED\', \'PAYMENT_PENDING\')',
      'INDEX idx_reservations_expiry (status, expires_at) WHERE status IN (\'RESERVED\', \'PAYMENT_PENDING\')'
    ],
    constraints: [
      'CHECK (quantity > 0)',
      'FOREIGN KEY (product_id) REFERENCES inventory(product_id)',
      'FOREIGN KEY (user_id) REFERENCES users(id)'
    ],
    criticalInvariant: 'Only one active reservation per customer per flash sale. Auto-released if expires_at < NOW().'
  },
  {
    name: 'payments',
    purpose: 'Maintains financial charge attempts, gateway transaction IDs, and idempotency guarantees for third-party billing.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Internal payment intent identifier' },
      { name: 'reservation_id', type: 'UUID', isFk: true, fkRef: 'reservations.id', description: 'Reservation that this payment settles' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', description: 'Customer making payment' },
      { name: 'idempotency_key', type: 'VARCHAR(128)', isUnique: true, nullable: false, description: 'Client-supplied uniqueness key' },
      { name: 'gateway_ref', type: 'VARCHAR(128)', description: 'Stripe/Adyen payment intent token' },
      { name: 'amount_cents', type: 'INT', nullable: false, description: 'Total charge amount in cents' },
      { name: 'currency', type: 'VARCHAR(3)', nullable: false, description: 'ISO 4217 Currency (e.g. USD, EUR)' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'INITIATED | SUCCEEDED | FAILED | TIMED_OUT | REFUNDED' },
      { name: 'error_code', type: 'VARCHAR(64)', nullable: true, description: 'Provider decline or failure reason' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Initiation time' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Finalization time' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'UNIQUE (idempotency_key)',
      'INDEX idx_payments_gateway_ref (gateway_ref)',
      'INDEX idx_payments_user_status (user_id, status)'
    ],
    constraints: [
      'CHECK (amount_cents > 0)',
      'FOREIGN KEY (reservation_id) REFERENCES reservations(id)',
      'FOREIGN KEY (user_id) REFERENCES users(id)'
    ],
    criticalInvariant: 'idempotency_key UNIQUE constraint prevents duplicate credit card charges under race conditions.'
  },
  {
    name: 'orders',
    purpose: 'Permanent, immutable legal record of completed customer purchases after successful payment validation.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Unique customer order number (e.g. ORD-2026-X884)' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', description: 'Purchasing customer' },
      { name: 'payment_id', type: 'UUID', isFk: true, fkRef: 'payments.id', isUnique: true, description: 'Payment reference' },
      { name: 'reservation_id', type: 'UUID', isFk: true, fkRef: 'reservations.id', isUnique: true, description: 'Inventory reservation token' },
      { name: 'idempotency_key', type: 'VARCHAR(128)', isUnique: true, nullable: false, description: 'Order creation deduplication key' },
      { name: 'total_amount_cents', type: 'INT', nullable: false, description: 'Final order total' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'CREATED | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Order generation time' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Status update time' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'UNIQUE (idempotency_key)',
      'UNIQUE (payment_id)',
      'UNIQUE (reservation_id)',
      'INDEX idx_orders_user_created (user_id, created_at DESC)'
    ],
    constraints: [
      'FOREIGN KEY (user_id) REFERENCES users(id)',
      'FOREIGN KEY (payment_id) REFERENCES payments(id)',
      'FOREIGN KEY (reservation_id) REFERENCES reservations(id)'
    ],
    criticalInvariant: 'Strict 1:1 mapping with payment_id and reservation_id. Guaranteed zero duplicate orders for single payment.'
  },
  {
    name: 'order_items',
    purpose: 'Line item records detailing quantity, unit price, and product specifications at time of purchase.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Line item identifier' },
      { name: 'order_id', type: 'UUID', isFk: true, fkRef: 'orders.id', description: 'Parent order reference' },
      { name: 'product_id', type: 'UUID', isFk: true, fkRef: 'products.id', description: 'Product item purchased' },
      { name: 'quantity', type: 'INT', nullable: false, description: 'Quantity purchased' },
      { name: 'unit_price_cents', type: 'INT', nullable: false, description: 'Captured price per unit at sale timestamp' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'INDEX idx_order_items_order (order_id)'
    ],
    constraints: [
      'FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE',
      'CHECK (quantity > 0)',
      'CHECK (unit_price_cents >= 0)'
    ],
    criticalInvariant: 'Price snapshot preserved immutably regardless of future catalog price modifications.'
  },
  {
    name: 'outbox_events',
    purpose: 'Transactional outbox table implementing reliable at-least-once message dispatch to Kafka without dual-write inconsistency.',
    columns: [
      { name: 'id', type: 'BIGSERIAL', isPk: true, description: 'Sequential auto-incrementing event ID' },
      { name: 'aggregate_type', type: 'VARCHAR(64)', nullable: false, description: 'e.g. PAYMENT, ORDER, INVENTORY' },
      { name: 'aggregate_id', type: 'VARCHAR(64)', nullable: false, description: 'ID of affected business entity' },
      { name: 'event_type', type: 'VARCHAR(64)', nullable: false, description: 'e.g. PaymentSucceeded, OrderCreated' },
      { name: 'payload', type: 'JSONB', nullable: false, description: 'Full event JSON schema' },
      { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'PENDING | PUBLISHED | FAILED' },
      { name: 'retry_count', type: 'INT', nullable: false, description: 'Number of publication retry attempts' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Commit timestamp in business transaction' },
      { name: 'published_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Timestamp confirmed delivered to broker' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'INDEX idx_outbox_pending (status, created_at) WHERE status = \'PENDING\''
    ],
    constraints: [],
    criticalInvariant: 'Inserted in the SAME ACID database transaction as payment/order mutations. Zero lost events.'
  },
  {
    name: 'idempotency_records',
    purpose: 'Fast-lookup cache of processed client keys to short-circuit duplicate writes and re-render identical outputs.',
    columns: [
      { name: 'key', type: 'VARCHAR(128)', isPk: true, description: 'Client idempotency key UUID' },
      { name: 'user_id', type: 'UUID', nullable: false, description: 'Authorized user token' },
      { name: 'endpoint', type: 'VARCHAR(128)', nullable: false, description: 'Target API route e.g. /payments/charge' },
      { name: 'request_hash', type: 'CHAR(64)', nullable: false, description: 'SHA-256 hash of payload to detect payload mutation' },
      { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'PROCESSING | COMPLETED | FAILED' },
      { name: 'response_status', type: 'INT', nullable: true, description: 'Cached HTTP response code (e.g. 200, 201)' },
      { name: 'response_body', type: 'JSONB', nullable: true, description: 'Cached JSON response payload' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Record creation timestamp' },
      { name: 'expires_at', type: 'TIMESTAMPTZ', nullable: false, description: 'TTL expiration (24h standard)' }
    ],
    indexes: [
      'PRIMARY KEY (key)',
      'INDEX idx_idempotency_expiry (expires_at)'
    ],
    constraints: [],
    criticalInvariant: 'If status = PROCESSING, parallel duplicate requests block or receive 409 Conflict. If COMPLETED, return cached response.'
  },
  {
    name: 'users',
    purpose: 'Customer identity, authentication credentials, and anti-fraud reputation scoring.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Unique user UUID' },
      { name: 'email', type: 'VARCHAR(255)', isUnique: true, nullable: false, description: 'Customer email' },
      { name: 'phone', type: 'VARCHAR(32)', description: 'SMS-verified telephone number' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'ACTIVE | SUSPENDED | BOT_FLAGGED' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Account registration timestamp' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'UNIQUE (email)'
    ],
    constraints: [],
    criticalInvariant: 'Suspended or BOT_FLAGGED accounts rejected at API gateway before touching inventory.'
  },
  {
    name: 'products',
    purpose: 'Master catalog details for goods offered across flash sale events.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Product identifier' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Display title' },
      { name: 'sku', type: 'VARCHAR(64)', isUnique: true, nullable: false, description: 'Stock keeping unit' },
      { name: 'base_price_cents', type: 'INT', nullable: false, description: 'Normal MSRP' },
      { name: 'sale_price_cents', type: 'INT', nullable: false, description: 'Discounted flash sale price' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'DRAFT | SCHEDULED | LIVE | CONCLUDED' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'UNIQUE (sku)'
    ],
    constraints: [],
    criticalInvariant: 'Live status gates the start and end of high-concurrency reservation eligibility.'
  },
  {
    name: 'shipments',
    purpose: 'Physical fulfillment tracking, warehouse dock allocation, and carrier label dispatch.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Shipment manifest ID' },
      { name: 'order_id', type: 'UUID', isFk: true, fkRef: 'orders.id', isUnique: true, description: 'Associated order' },
      { name: 'carrier', type: 'VARCHAR(64)', description: 'FedEx | UPS | DHL' },
      { name: 'tracking_number', type: 'VARCHAR(128)', description: 'Carrier tracking code' },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, description: 'PENDING | PACKED | IN_TRANSIT | DELIVERED' },
      { name: 'dispatched_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Handoff to carrier time' }
    ],
    indexes: [
      'PRIMARY KEY (id)',
      'UNIQUE (order_id)'
    ],
    constraints: [],
    criticalInvariant: 'Decoupled from payment confirmation; failure does not impact customer financial transaction.'
  },
  {
    name: 'carts',
    purpose: 'Temporary shopping basket for pre-sale browsing before flash reservation.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Cart identifier' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', description: 'Customer reference' },
      { name: 'expires_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Abandonment timeout' }
    ],
    indexes: ['PRIMARY KEY (id)', 'INDEX idx_cart_user (user_id)'],
    constraints: [],
    criticalInvariant: 'Cart holding DOES NOT reserve stock. Only explicit Buy Now / Reservation holds inventory.'
  },
  {
    name: 'cart_items',
    purpose: 'Line items within temporary browsing cart.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Cart item ID' },
      { name: 'cart_id', type: 'UUID', isFk: true, fkRef: 'carts.id', description: 'Cart reference' },
      { name: 'product_id', type: 'UUID', isFk: true, fkRef: 'products.id', description: 'Product' },
      { name: 'quantity', type: 'INT', nullable: false, description: 'Selected count' }
    ],
    indexes: ['PRIMARY KEY (id)', 'INDEX idx_cart_items (cart_id)'],
    constraints: [],
    criticalInvariant: 'No inventory subtraction occurs on cart_items additions.'
  }
];
