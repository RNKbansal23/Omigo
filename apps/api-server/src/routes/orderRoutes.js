// ─── Order Routes ───────────────────────────────────────────
const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const {
  createOrder,
  verifyPayment,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = Router();

// ─── Validation Rules ───────────────────────────────────────

const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item.'),
  body('items.*.productId')
    .notEmpty()
    .withMessage('Each item must have a productId.'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must have a quantity of at least 1.'),
  body('deliveryAddress')
    .notEmpty()
    .withMessage('Delivery address is required.'),
  body('deliveryAddress.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Street address cannot be empty.'),
  body('deliveryAddress.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty.'),
  body('deliveryAddress.pincode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Pincode cannot be empty.'),
  body('giftMessage')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Gift message must be at most 500 characters.'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('scheduledAt must be a valid ISO 8601 date.'),
];

const verifyPaymentValidation = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('razorpay_order_id is required.'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('razorpay_payment_id is required.'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('razorpay_signature is required.'),
];

const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn([
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
    ])
    .withMessage('Invalid order status.'),
];

// ─── Authenticated Customer Routes ─────────────────────────

router.post(
  '/',
  authenticate,
  createOrderValidation,
  createOrder
);

router.post(
  '/verify-payment',
  authenticate,
  verifyPaymentValidation,
  verifyPayment
);

router.get(
  '/my',
  authenticate,
  getUserOrders
);

router.get(
  '/:id',
  authenticate,
  getOrderById
);

// ─── Admin-Only Routes ──────────────────────────────────────

router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  getAllOrders
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  updateStatusValidation,
  updateOrderStatus
);

module.exports = router;
