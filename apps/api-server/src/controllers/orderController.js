// ─── Order Controller ───────────────────────────────────────
const { prisma } = require('../config/db');
const { validationResult } = require('express-validator');
const {
  createPaymentOrder,
  verifyPaymentSignature,
} = require('../services/paymentService');
const { getIO } = require('../sockets/trackingSocket');
const { scheduleOrderDelivery } = require('../queues/deliveryQueue');

/**
 * POST /api/orders
 * Create a new order and initiate Razorpay payment.
 */
async function createOrder(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array(),
      });
    }

    const { items, deliveryAddress, giftMessage, scheduledAt } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.',
      });
    }

    // Fetch product details and validate stock
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more products are unavailable.',
      });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate stock & compute total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product "${product.name}".`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }

      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create Razorpay order
    const razorpayOrder = await createPaymentOrder(totalAmount, `order_${Date.now()}`, {
      userId,
    });

    // Create order in DB within a transaction (order + decrement stock)
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          razorpayOrderId: razorpayOrder.id,
          deliveryAddress,
          giftMessage: giftMessage || null,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          items: {
            create: orderItems,
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Decrement stock
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    // If scheduled delivery, add to pg-boss queue
    if (scheduledAt) {
      const delay = new Date(scheduledAt).getTime() - Date.now();
      if (delay > 0) {
        await scheduleOrderDelivery(order.id, delay);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created. Complete payment to confirm.',
      data: {
        order,
        payment: {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/orders/verify-payment
 * Verify Razorpay payment signature and update order status.
 */
async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification fields.',
      });
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      // Mark payment as failed
      await prisma.order.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: { paymentStatus: 'FAILED' },
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }

    // Update order
    const order = await prisma.order.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        paymentId: razorpay_payment_id,
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
      include: { items: { include: { product: true } } },
    });

    // Emit socket event for real-time tracking
    try {
      const io = getIO();
      io.to(`order:${order.id}`).emit('orderStatusUpdate', {
        orderId: order.id,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        updatedAt: new Date().toISOString(),
      });
    } catch (_socketErr) {
      // Socket not initialized yet — non-critical
    }

    res.json({
      success: true,
      message: 'Payment verified successfully. Order confirmed.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/:id
 * Get a single order by ID (owner or admin).
 */
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Only the order owner or an admin can view the order
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/my
 * Get all orders for the authenticated user.
 */
async function getUserOrders(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = { userId: req.user.id };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders  (Admin only)
 * Get all orders with optional status filter and pagination.
 */
async function getAllOrders(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const allowedSortFields = ['createdAt', 'totalAmount', 'status'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeOrder = order === 'asc' ? 'asc' : 'desc';

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
        orderBy: { [safeSortBy]: safeOrder },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/orders/:id/status  (Admin only)
 * Update the order status and emit a real-time socket event.
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, trackingInfo } = req.body;

    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    const updateData = { status };
    if (trackingInfo) updateData.trackingInfo = trackingInfo;
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();

    // If cancelling a paid order, mark for refund
    if (status === 'CANCELLED' && existing.paymentStatus === 'PAID') {
      updateData.paymentStatus = 'REFUNDED';
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: { include: { product: true } },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // If cancelled, restore stock
    if (status === 'CANCELLED') {
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: id },
      });
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    // Emit socket event
    try {
      const io = getIO();
      io.to(`order:${id}`).emit('orderStatusUpdate', {
        orderId: id,
        status: order.status,
        trackingInfo: order.trackingInfo,
        deliveredAt: order.deliveredAt,
        updatedAt: new Date().toISOString(),
      });
    } catch (_socketErr) {
      // Socket not available — non-critical
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
