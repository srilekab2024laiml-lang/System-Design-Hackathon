export interface SimulationConfig {
  customers: number;
  inventory: number;
  quantityPerCustomer: number;
  paymentFailureRate: number; // percentage 0-100
  networkFailureRate: number; // percentage 0-100
  orderServiceFailure: boolean; // if true, order service is offline
  reservationTimeoutRate: number; // percentage of customers who abandon reservation
  isUnsafeMode: boolean; // if true, runs educational race condition logic
}

export interface SimulationLogEntry {
  id: string;
  timestamp: string;
  timeOffsetMs: number;
  userId: string;
  action: 'RESERVATION_REQUEST' | 'RESERVATION_SUCCESS' | 'OUT_OF_STOCK' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'ORDER_CREATED' | 'OUTBOX_BUFFERED' | 'RESERVATION_EXPIRED' | 'OVERSELL_DETECTED' | 'IDEMPOTENCY_DEDUP';
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: Record<string, any>;
}

export interface SimulationResult {
  totalRequests: number;
  initialStock: number;
  successfulReservations: number;
  successfulSales: number;
  rejectedOutOfStock: number;
  oversoldUnits: number;
  duplicateRequestsPrevented: number;
  paymentFailures: number;
  orderServiceBuffered: number;
  abandonedAndReleased: number;
  finalAvailableStock: number;
  finalReservedStock: number;
  finalSoldStock: number;
  executionTimeMs: number;
  invariantPassed: boolean;
  logs: SimulationLogEntry[];
}

export function runSimulation(config: SimulationConfig): SimulationResult {
  const startTime = performance.now();
  const logs: SimulationLogEntry[] = [];
  const baseTime = new Date('2026-10-05T12:00:00.000Z');

  let availableStock = config.inventory;
  let reservedStock = 0;
  let soldStock = 0;
  let oversoldCount = 0;
  let successfulReservations = 0;
  let successfulSales = 0;
  let rejectedOutOfStock = 0;
  let duplicateRequestsPrevented = 0;
  let paymentFailures = 0;
  let orderServiceBuffered = 0;
  let abandonedAndReleased = 0;

  const seenUsers = new Set<string>();

  const formatLogTime = (msOffset: number) => {
    const d = new Date(baseTime.getTime() + msOffset);
    return d.toISOString().substring(11, 23);
  };

  if (!config.isUnsafeMode) {
    // ==========================================
    // SAFE ARCHITECTURE SIMULATION (ATOMIC LOCK)
    // ==========================================
    for (let i = 1; i <= config.customers; i++) {
      const userIndex = i;
      const userId = `U-${String(userIndex).padStart(5, '0')}`;
      const timeOffset = Math.floor(Math.random() * 200) + Math.floor(i / 50); // burst in first 200ms

      // Simulate aggressive duplicate request for 3% of users
      const hasDuplicateSpam = (i % 31 === 0);
      if (hasDuplicateSpam && seenUsers.has(userId)) {
        duplicateRequestsPrevented++;
        if (logs.length < 500) {
          logs.push({
            id: `log-${logs.length}`,
            timestamp: formatLogTime(timeOffset + 5),
            timeOffsetMs: timeOffset + 5,
            userId,
            action: 'IDEMPOTENCY_DEDUP',
            status: 'info',
            message: `Duplicate 'Buy Now' detected. Redis mutex blocked re-execution. Returned existing state.`
          });
        }
        continue;
      }
      seenUsers.add(userId);

      // ATOMIC INVENTORY EVALUATION:
      // UPDATE inventory SET available = available - qty, reserved = reserved + qty 
      // WHERE product_id = :id AND available >= qty
      if (availableStock >= config.quantityPerCustomer) {
        availableStock -= config.quantityPerCustomer;
        reservedStock += config.quantityPerCustomer;
        successfulReservations++;

        if (logs.length < 500) {
          logs.push({
            id: `log-${logs.length}`,
            timestamp: formatLogTime(timeOffset),
            timeOffsetMs: timeOffset,
            userId,
            action: 'RESERVATION_SUCCESS',
            status: 'success',
            message: `Atomically reserved 1 unit. Remaining available: ${availableStock}. Held lease granted for 300s.`
          });
        }

        // Check if customer abandons (reservation timeout)
        const willAbandon = (Math.random() * 100) < config.reservationTimeoutRate;
        if (willAbandon) {
          // Expiry simulation
          reservedStock -= config.quantityPerCustomer;
          availableStock += config.quantityPerCustomer;
          abandonedAndReleased++;

          if (logs.length < 500) {
            logs.push({
              id: `log-${logs.length}`,
              timestamp: formatLogTime(timeOffset + 300000),
              timeOffsetMs: timeOffset + 3000,
              userId,
              action: 'RESERVATION_EXPIRED',
              status: 'warning',
              message: `Checkout lease expired (300s timeout). Sweeper released 1 unit back to available pool.`
            });
          }
          continue;
        }

        // Simulate Payment Phase
        const paymentFails = (Math.random() * 100) < config.paymentFailureRate;
        if (paymentFails) {
          paymentFailures++;
          // Release reservation on explicit payment failure
          reservedStock -= config.quantityPerCustomer;
          availableStock += config.quantityPerCustomer;

          if (logs.length < 500) {
            logs.push({
              id: `log-${logs.length}`,
              timestamp: formatLogTime(timeOffset + 1200),
              timeOffsetMs: timeOffset + 1200,
              userId,
              action: 'PAYMENT_FAILED',
              status: 'error',
              message: `Payment gateway declined card. Reservation released; unit restored to stock.`
            });
          }
        } else {
          // Payment Succeeded
          reservedStock -= config.quantityPerCustomer;
          soldStock += config.quantityPerCustomer;
          successfulSales++;

          if (logs.length < 500) {
            logs.push({
              id: `log-${logs.length}`,
              timestamp: formatLogTime(timeOffset + 850),
              timeOffsetMs: timeOffset + 850,
              userId,
              action: 'PAYMENT_SUCCESS',
              status: 'success',
              message: `Payment captured ($199.00). Idempotency key verified.`
            });
          }

          // Order Service Check
          if (config.orderServiceFailure) {
            orderServiceBuffered++;
            if (logs.length < 500) {
              logs.push({
                id: `log-${logs.length}`,
                timestamp: formatLogTime(timeOffset + 860),
                timeOffsetMs: timeOffset + 860,
                userId,
                action: 'OUTBOX_BUFFERED',
                status: 'warning',
                message: `[Order Service DOWN] Payment committed. 'PaymentSucceeded' event written to PostgreSQL Outbox table & buffered in Kafka.`
              });
            }
          } else {
            if (logs.length < 500) {
              logs.push({
                id: `log-${logs.length}`,
                timestamp: formatLogTime(timeOffset + 920),
                timeOffsetMs: timeOffset + 920,
                userId,
                action: 'ORDER_CREATED',
                status: 'success',
                message: `Order ORD-${userId}-99 created idempotently. Kafka consumer acknowledged.`
              });
            }
          }
        }

      } else {
        // Stock exhausted
        rejectedOutOfStock++;
        if (logs.length < 250) {
          logs.push({
            id: `log-${logs.length}`,
            timestamp: formatLogTime(timeOffset),
            timeOffsetMs: timeOffset,
            userId,
            action: 'OUT_OF_STOCK',
            status: 'info',
            message: `Out of stock: WHERE available >= 1 matched 0 rows. Fast rejected in 8ms.`
          });
        }
      }
    }

  } else {
    // ============================================
    // EDUCATIONAL UNSAFE SIMULATION (RACE CONDITION)
    // ============================================
    // In naive code:
    // 1. Thread reads stock (sees stock > 0)
    // 2. Application waits or performs non-atomic logic
    // 3. Decrements stock
    // Result: multiple threads read stock simultaneously when stock is near 0 and all decrement!
    let naiveStock = config.inventory;
    
    // Simulate first 250 concurrent requests hitting the race condition window
    for (let i = 1; i <= config.customers; i++) {
      const userId = `U-${String(i).padStart(5, '0')}`;
      const timeOffset = Math.floor(Math.random() * 50);

      // Race window: 30 threads check stock at the same instant before any thread writes back
      const readStockSnapshot = naiveStock;
      
      if (readStockSnapshot > 0) {
        // Unsafe decrement without row lock
        naiveStock -= 1;
        if (naiveStock < 0) {
          oversoldCount += 1;
          if (logs.length < 500) {
            logs.push({
              id: `log-${logs.length}`,
              timestamp: formatLogTime(timeOffset),
              timeOffsetMs: timeOffset,
              userId,
              action: 'OVERSELL_DETECTED',
              status: 'error',
              message: `[RACE CONDITION] Unsafe read-check-write collided! Customer reserved item but physical stock is now ${naiveStock} (Oversold!)`
            });
          }
        } else {
          successfulReservations++;
          successfulSales++;
          if (logs.length < 500) {
            logs.push({
              id: `log-${logs.length}`,
              timestamp: formatLogTime(timeOffset),
              timeOffsetMs: timeOffset,
              userId,
              action: 'RESERVATION_SUCCESS',
              status: 'warning',
              message: `Unsafe reservation committed without lock. Current naive stock: ${naiveStock}`
            });
          }
        }
      } else {
        rejectedOutOfStock++;
      }
    }

    availableStock = Math.max(0, naiveStock);
    soldStock = successfulSales + oversoldCount;
  }

  // Sort logs by timeOffset
  logs.sort((a, b) => a.timeOffsetMs - b.timeOffsetMs);

  const executionTime = Math.round(performance.now() - startTime);

  // Invariant assertion:
  // In safe mode: successfulSales <= initialStock AND oversoldUnits === 0 AND availableStock >= 0
  const invariantPassed = !config.isUnsafeMode 
    ? (successfulSales <= config.inventory && oversoldCount === 0 && availableStock >= 0)
    : false;

  return {
    totalRequests: config.customers,
    initialStock: config.inventory,
    successfulReservations,
    successfulSales,
    rejectedOutOfStock,
    oversoldUnits: oversoldCount,
    duplicateRequestsPrevented,
    paymentFailures,
    orderServiceBuffered,
    abandonedAndReleased,
    finalAvailableStock: availableStock,
    finalReservedStock: reservedStock,
    finalSoldStock: soldStock,
    executionTimeMs: executionTime,
    invariantPassed,
    logs: logs.slice(0, 1000)
  };
}
