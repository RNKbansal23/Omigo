// ─── Socket.io Tracking Setup ───────────────────────────────
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

/** @type {Server | null} */
let io = null;

/**
 * Initialize Socket.io on the given HTTP server.
 * @param {import('http').Server} httpServer
 * @returns {Server} The Socket.io server instance
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // ─── Authentication Middleware ──────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  // ─── Connection Handler ────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`🔌  Socket connected: ${socket.id} (user: ${socket.userId})`);

    /**
     * Client joins an order room to receive real-time updates.
     * Payload: { orderId: string }
     */
    socket.on('joinOrder', ({ orderId }) => {
      if (!orderId) return;
      const room = `order:${orderId}`;
      socket.join(room);
      console.log(`📦  Socket ${socket.id} joined room ${room}`);
      socket.emit('joinedOrder', { orderId, message: 'Subscribed to order updates.' });
    });

    /**
     * Client leaves an order room.
     * Payload: { orderId: string }
     */
    socket.on('leaveOrder', ({ orderId }) => {
      if (!orderId) return;
      const room = `order:${orderId}`;
      socket.leave(room);
      console.log(`🚪  Socket ${socket.id} left room ${room}`);
    });

    /**
     * Delivery agent pushes a location update.
     * Only allowed for admin/delivery roles.
     * Payload: { orderId: string, lat: number, lng: number }
     */
    socket.on('deliveryLocationUpdate', ({ orderId, lat, lng }) => {
      if (!orderId || lat == null || lng == null) return;

      // Broadcast to everyone tracking this order
      io.to(`order:${orderId}`).emit('deliveryLocation', {
        orderId,
        lat,
        lng,
        updatedAt: new Date().toISOString(),
      });
    });

    /**
     * Admin / system broadcasts an order status change.
     * Payload: { orderId, status, trackingInfo? }
     */
    socket.on('orderStatusUpdate', ({ orderId, status, trackingInfo }) => {
      if (!orderId || !status) return;

      io.to(`order:${orderId}`).emit('orderStatusUpdate', {
        orderId,
        status,
        trackingInfo: trackingInfo || null,
        updatedAt: new Date().toISOString(),
      });
    });

    // ─── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`🔌  Socket disconnected: ${socket.id} (${reason})`);
    });

    socket.on('error', (err) => {
      console.error(`❌  Socket error (${socket.id}):`, err.message);
    });
  });

  console.log('✅  Socket.io initialized');
  return io;
}

/**
 * Get the active Socket.io instance.
 * @returns {Server}
 * @throws {Error} If initSocket hasn't been called yet.
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket(server) first.');
  }
  return io;
}

module.exports = { initSocket, getIO };
