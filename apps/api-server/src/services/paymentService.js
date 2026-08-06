// ─── Razorpay Payment Service ───────────────────────────────
const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Lazily-initialized Razorpay instance.
 * Keys are read from env at call time so .env is loaded first.
 */
let razorpayInstance = null;

function getRazorpayInstance() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * Create a Razorpay order for a given amount.
 * @param {number} amount    – Amount in INR (will be converted to paise)
 * @param {string} receipt   – Unique receipt / order ID reference
 * @param {object} [notes]   – Optional key-value notes
 * @returns {Promise<object>} Razorpay order object
 */
async function createPaymentOrder(amount, receipt, notes = {}) {
  const razorpay = getRazorpayInstance();

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt,
    notes,
  };

  const order = await razorpay.orders.create(options);
  return order;
}

/**
 * Verify the payment signature returned by Razorpay checkout.
 * @param {string} razorpayOrderId   – The order_id from Razorpay
 * @param {string} razorpayPaymentId – The payment_id from Razorpay
 * @param {string} razorpaySignature – The signature from Razorpay
 * @returns {boolean} Whether the signature is valid
 */
function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === razorpaySignature;
}

/**
 * Fetch payment details from Razorpay.
 * @param {string} paymentId – Razorpay payment ID
 * @returns {Promise<object>} Payment details
 */
async function fetchPaymentDetails(paymentId) {
  const razorpay = getRazorpayInstance();
  return razorpay.payments.fetch(paymentId);
}

/**
 * Initiate a refund for a payment.
 * @param {string} paymentId – Razorpay payment ID
 * @param {number} [amount]  – Partial refund amount in INR (omit for full refund)
 * @returns {Promise<object>} Refund details
 */
async function initiateRefund(paymentId, amount) {
  const razorpay = getRazorpayInstance();
  const options = {};
  if (amount) {
    options.amount = Math.round(amount * 100); // Convert to paise
  }
  return razorpay.payments.refund(paymentId, options);
}

module.exports = {
  getRazorpayInstance,
  createPaymentOrder,
  verifyPaymentSignature,
  fetchPaymentDetails,
  initiateRefund,
};
