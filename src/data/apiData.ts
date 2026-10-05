import { ApiEndpoint } from '../types';

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'api-prod-01',
    group: 'Product',
    method: 'GET',
    path: '/api/v1/products/{id}',
    summary: 'Retrieve product specifications, media assets, flash sale pricing, and schedule details.',
    idempotent: true,
    idempotencyHeaderRequired: false,
    responseBody: JSON.stringify({
      id: "prod-9941a8",
      title: "HyperEdition Quantum Console X",
      sku: "HEX-CON-001",
      regularPriceCents: 49900,
      salePriceCents: 19900,
      saleStartTime: "2026-10-05T12:00:00Z",
      saleEndTime: "2026-10-05T12:15:00Z",
      status: "LIVE"
    }, null, 2),
    statusCodes: [
      { code: 200, description: 'Product metadata returned from cache' },
      { code: 404, description: 'Product not found' }
    ],
    failureCases: ['Origin timeout falls back to cached CDN edge copy with 60s stale TTL'],
    latencyTarget: '< 20ms (Edge Cached)'
  },
  {
    id: 'api-prod-02',
    group: 'Product',
    method: 'GET',
    path: '/api/v1/products/{id}/availability',
    summary: 'Get low-latency approximate inventory status indicator (IN_STOCK, LOW_STOCK, SOLD_OUT).',
    idempotent: true,
    idempotencyHeaderRequired: false,
    responseBody: JSON.stringify({
      productId: "prod-9941a8",
      status: "IN_STOCK",
      remainingEstimate: "FEW_LEFT",
      asOf: "2026-10-05T12:00:04.120Z"
    }, null, 2),
    statusCodes: [
      { code: 200, description: 'Inventory availability hint returned' },
      { code: 429, description: 'Client polling rate exceeded threshold' }
    ],
    failureCases: ['Served from Redis read replicas; slight 500ms eventual lag allowed; non-authoritative hint only'],
    latencyTarget: '< 15ms'
  },
  {
    id: 'api-res-01',
    group: 'Reservation',
    method: 'POST',
    path: '/api/v1/reservations',
    summary: 'Atomically reserve 1 unit of flash sale inventory for 5 minutes during high-concurrency Buy Now burst.',
    idempotent: true,
    idempotencyHeaderRequired: true,
    requestHeaders: {
      "Authorization": "Bearer eyJhbGciOi...",
      "Idempotency-Key": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "Content-Type": "application/json"
    },
    requestBody: JSON.stringify({
      productId: "prod-9941a8",
      quantity: 1
    }, null, 2),
    responseBody: JSON.stringify({
      reservationId: "res-7721bc-99a",
      productId: "prod-9941a8",
      userId: "usr-441209",
      quantity: 1,
      status: "RESERVED",
      expiresAt: "2026-10-05T12:05:04.220Z",
      ttlSecondsRemaining: 300,
      checkoutUrl: "/checkout/session/res-7721bc-99a"
    }, null, 2),
    statusCodes: [
      { code: 201, description: 'Reservation granted and inventory decrement committed' },
      { code: 409, description: 'Out of stock (available_quantity = 0) OR User already holds active reservation' },
      { code: 429, description: 'Rate limit tripped at API gateway' }
    ],
    failureCases: ['Database lock timeout under extreme contention (>50ms); fast-fails with 409 OUT_OF_STOCK'],
    latencyTarget: '< 80ms (Authoritative ACID update)'
  },
  {
    id: 'api-res-02',
    group: 'Reservation',
    method: 'GET',
    path: '/api/v1/reservations/{id}',
    summary: 'Inspect status, remaining TTL, and checkout validity of an existing reservation.',
    idempotent: true,
    idempotencyHeaderRequired: false,
    responseBody: JSON.stringify({
      reservationId: "res-7721bc-99a",
      status: "PAYMENT_PENDING",
      expiresAt: "2026-10-05T12:05:04.220Z",
      secondsRemaining: 184
    }, null, 2),
    statusCodes: [
      { code: 200, description: 'Reservation valid and active' },
      { code: 410, description: 'Reservation expired and inventory returned to pool' }
    ],
    failureCases: ['Expired reservation returns HTTP 410 Gone with redirect to product page'],
    latencyTarget: '< 25ms'
  },
  {
    id: 'api-res-03',
    group: 'Reservation',
    method: 'DELETE',
    path: '/api/v1/reservations/{id}',
    summary: 'Manually release held reservation and immediately increment available stock when user cancels checkout.',
    idempotent: true,
    idempotencyHeaderRequired: false,
    responseBody: JSON.stringify({
      reservationId: "res-7721bc-99a",
      status: "RELEASED",
      stockReturned: 1
    }, null, 2),
    statusCodes: [
      { code: 200, description: 'Reservation cancelled, inventory returned' },
      { code: 404, description: 'Reservation not found or already settled' }
    ],
    failureCases: ['Attempting to release already confirmed order returns 400 Bad Request'],
    latencyTarget: '< 40ms'
  },
  {
    id: 'api-pay-01',
    group: 'Payment',
    method: 'POST',
    path: '/api/v1/payments/charge',
    summary: 'Process payment for reserved inventory with required Idempotency-Key. Stages Outbox record on success.',
    idempotent: true,
    idempotencyHeaderRequired: true,
    requestHeaders: {
      "Authorization": "Bearer eyJhbGciOi...",
      "Idempotency-Key": "pay-key-883a-4421-bc09",
      "Content-Type": "application/json"
    },
    requestBody: JSON.stringify({
      reservationId: "res-7721bc-99a",
      paymentMethodId: "pm_card_visa_tok_9918",
      amountCents: 19900,
      currency: "USD"
    }, null, 2),
    responseBody: JSON.stringify({
      paymentId: "pay-4412-009",
      status: "SUCCEEDED",
      reservationId: "res-7721bc-99a",
      amountCents: 19900,
      gatewayTransactionId: "ch_3N8cABC9921",
      orderPending: true
    }, null, 2),
    statusCodes: [
      { code: 200, description: 'Payment captured and outbox event written' },
      { code: 402, description: 'Payment declined by issuing bank (insufficient funds, card expired)' },
      { code: 408, description: 'Payment gateway timeout; status pending asynchronous reconciliation' },
      { code: 409, description: 'Idempotency key collision or conflicting in-flight transaction' }
    ],
    failureCases: ['Gateway network timeout invokes status verification hook before releasing reservation'],
    latencyTarget: '< 450ms (External banking gateway round-trip)'
  },
  {
    id: 'api-pay-02',
    group: 'Payment',
    method: 'POST',
    path: '/api/v1/payments/webhook',
    summary: 'Asynchronous webhook receiver from payment processor (Stripe/Adyen) with cryptographic HMAC signature verification.',
    idempotent: true,
    idempotencyHeaderRequired: false,
    requestHeaders: {
      "Stripe-Signature": "t=1696507204,v1=5257a869e7..."
    },
    requestBody: JSON.stringify({
      id: "evt_3N8cABC9921_success",
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_3N8cABC9921",
          amount: 19900,
          metadata: { reservationId: "res-7721bc-99a" }
        }
      }
    }, null, 2),
    responseBody: JSON.stringify({ received: true }),
    statusCodes: [
      { code: 200, description: 'Webhook acknowledged and enqueued' },
      { code: 400, description: 'Invalid cryptographic signature' }
    ],
    failureCases: ['Duplicate webhook events deduplicated via payment_events idempotency log'],
    latencyTarget: '< 30ms (Fast 200 ACK)'
  },
  {
    id: 'api-ord-01',
    group: 'Orders',
    method: 'POST',
    path: '/api/v1/orders',
    summary: 'Internal idempotent order creation endpoint triggered by payment completion or Kafka outbox worker.',
    idempotent: true,
    idempotencyHeaderRequired: true,
    requestBody: JSON.stringify({
      paymentId: "pay-4412-009",
      reservationId: "res-7721bc-99a",
      userId: "usr-441209",
      totalAmountCents: 19900
    }, null, 2),
    responseBody: JSON.stringify({
      orderId: "ord-2026-X884",
      status: "CONFIRMED",
      paymentId: "pay-4412-009",
      trackingUrl: "/orders/ord-2026-X884/track"
    }, null, 2),
    statusCodes: [
      { code: 201, description: 'Order created and persisted' },
      { code: 200, description: 'Order already existed (idempotent replay)' }
    ],
    failureCases: ['If database unavailable, message remains in Kafka queue for automated consumer retry'],
    latencyTarget: '< 50ms'
  },
  {
    id: 'api-ord-02',
    group: 'Orders',
    method: 'GET',
    path: '/api/v1/orders/{id}',
    summary: 'Fetch order receipt, line items, payment audit trail, and courier shipment status.',
    idempotent: true,
    idempotencyHeaderRequired: false,
    responseBody: JSON.stringify({
      orderId: "ord-2026-X884",
      status: "CONFIRMED",
      product: "HyperEdition Quantum Console X",
      quantity: 1,
      totalAmountCents: 19900,
      createdAt: "2026-10-05T12:03:15.110Z",
      shipment: {
        carrier: "FedEx Priority",
        status: "LABEL_CREATED",
        trackingNumber: "FX-9912048201"
      }
    }, null, 2),
    statusCodes: [
      { code: 200, description: 'Order details returned' },
      { code: 404, description: 'Order not found' }
    ],
    failureCases: ['Cross-customer query blocked with 403 Forbidden'],
    latencyTarget: '< 30ms'
  }
];
