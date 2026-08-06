// ─── Prisma Client Singleton ────────────────────────────────
const { PrismaClient } = require('@prisma/client');

/** @type {PrismaClient} */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  // Prevent multiple instances during hot-reload in development
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.__prisma;
}

/**
 * Connect to the database and log the result.
 * Called once at server startup.
 */
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅  Database connected successfully');
  } catch (error) {
    console.error('❌  Database connection failed:', error.message);
    process.exit(1);
  }
}

/**
 * Gracefully disconnect from the database.
 */
async function disconnectDB() {
  await prisma.$disconnect();
  console.log('🔌  Database disconnected');
}

module.exports = { prisma, connectDB, disconnectDB };
