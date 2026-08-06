// ─── Server Entry Point ─────────────────────────────────────
require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const { connectDB, disconnectDB } = require('./src/config/db');

const { initSocket } = require('./src/sockets/trackingSocket');
const { startDeliveryWorker, scheduleMidnightDeliveries, closeDeliveryQueue } = require('./src/queues/deliveryQueue');

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function startServer() {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Create HTTP server and attach Express app
    const server = http.createServer(app);

    // 3. Initialize Socket.io
    initSocket(server);

    // 4. Start delivery worker
    await startDeliveryWorker();
    await scheduleMidnightDeliveries();

    // 5. Start listening
    server.listen(PORT, () => {
      console.log(`
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │   🎁  Delivery & Gifting API                     │
  │   🚀  Server running on port ${String(PORT).padEnd(5)}               │
  │   📡  Socket.io attached                         │
  │   🗄️   Database connected                        │
  │   📦  Delivery queue worker active               │
  │   🌍  Environment: ${(process.env.NODE_ENV || 'development').padEnd(15)}          │
  │                                                  │
  └──────────────────────────────────────────────────┘
      `);
    });

    // ─── Graceful Shutdown ──────────────────────────────────
    const shutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log('🔌  HTTP server closed');

        await closeDeliveryQueue();
        await disconnectDB();

        console.log('👋  All connections closed. Goodbye!');
        process.exit(0);
      });

      // Force shutdown after 15 seconds
      setTimeout(() => {
        console.error('⏰  Forced shutdown after timeout');
        process.exit(1);
      }, 15000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // ─── Unhandled Errors ───────────────────────────────────
    process.on('unhandledRejection', (reason) => {
      console.error('❌  Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('❌  Uncaught Exception:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌  Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
