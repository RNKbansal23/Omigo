// ─── pg-boss Delivery Queue & Worker (PostgreSQL-native, no Redis) ──
const PgBoss = require('pg-boss');
const { prisma } = require('../config/db');

/** @type {PgBoss | null} */
let boss = null;

/**
 * Initialize pg-boss and register job workers.
 * Called once at server startup.
 */
async function startDeliveryWorker() {
  boss = new PgBoss(process.env.DATABASE_URL);

  boss.on('error', (err) => {
    console.error('❌  pg-boss error:', err.message);
  });

  await boss.start();
  await boss.createQueue('scheduled-delivery');
  await boss.createQueue('midnight-delivery');

  // Worker: process individual scheduled deliveries
  await boss.work('scheduled-delivery', async ([job]) => {
    console.log(`📦  Processing job ${job.id} — scheduled-delivery`);
    await processScheduledDelivery(job);
  });

  // Worker: process midnight batch
  await boss.work('midnight-delivery', async ([job]) => {
    console.log(`🌙  Processing job ${job.id} — midnight-delivery`);
    await processMidnightDelivery(job);
  });

  console.log('✅  Delivery queue worker started (pg-boss / PostgreSQL)');
  return boss;
}

/**
 * Schedule the midnight delivery batch job (runs daily at 00:00).
 * pg-boss schedule() is idempotent — safe to call on every startup.
 */
async function scheduleMidnightDeliveries() {
  if (!boss) return;
  await boss.schedule('midnight-delivery', '0 0 * * *', {});
  console.log('🌙  Midnight delivery batch job scheduled');
}

/**
 * Schedule a delayed delivery job for a specific order.
 * @param {string} orderId
 * @param {number} delayMs – delay in milliseconds
 */
async function scheduleOrderDelivery(orderId, delayMs) {
  if (!boss) return;
  const startAfterSeconds = Math.max(1, Math.ceil(delayMs / 1000));
  await boss.send(
    'scheduled-delivery',
    { orderId },
    { startAfter: startAfterSeconds, retryLimit: 3, retryDelay: 5 }
  );
  console.log(`⏰  Scheduled delivery for order ${orderId} in ${startAfterSeconds}s`);
}

// ─── Job Processors ─────────────────────────────────────────

async function processScheduledDelivery(job) {
  const { orderId } = job.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  if (order.status !== 'CONFIRMED') {
    console.log(`⏭️  Skipping order ${orderId} — status is ${order.status}`);
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PREPARING',
      trackingInfo: {
        ...(order.trackingInfo || {}),
        preparingAt: new Date().toISOString(),
        message: 'Your scheduled delivery is being prepared!',
      },
    },
  });

  // Emit socket event if available
  try {
    const { getIO } = require('../sockets/trackingSocket');
    const io = getIO();
    io.to(`order:${orderId}`).emit('orderStatusUpdate', {
      orderId,
      status: 'PREPARING',
      message: 'Your scheduled delivery is being prepared!',
      updatedAt: new Date().toISOString(),
    });
  } catch (_err) {
    // Socket may not be initialized in worker context — non-critical
  }

  console.log(`📦  Order ${orderId} moved to PREPARING (scheduled delivery)`);
}

async function processMidnightDelivery() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const scheduledOrders = await prisma.order.findMany({
    where: {
      status: 'CONFIRMED',
      scheduledAt: { gte: today, lt: tomorrow },
    },
  });

  console.log(`🌙  Found ${scheduledOrders.length} orders for midnight delivery batch`);

  for (const order of scheduledOrders) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PREPARING',
        trackingInfo: {
          ...(order.trackingInfo || {}),
          preparingAt: new Date().toISOString(),
          message: 'Your midnight delivery is being prepared!',
        },
      },
    });
  }

  return { processed: scheduledOrders.length };
}

/**
 * Gracefully stop pg-boss.
 */
async function closeDeliveryQueue() {
  if (boss) {
    await boss.stop({ graceful: true });
  }
  console.log('🔌  Delivery queue closed');
}

module.exports = {
  startDeliveryWorker,
  scheduleMidnightDeliveries,
  scheduleOrderDelivery,
  closeDeliveryQueue,
};
