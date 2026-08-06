// ─── Product Routes ─────────────────────────────────────────
const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = Router();

// ─── Validation Rules ───────────────────────────────────────

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required.')
    .isLength({ max: 200 })
    .withMessage('Product name must be at most 200 characters.'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters.'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs.'),
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty.')
    .isLength({ max: 200 }),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number.'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty.'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer.'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.'),
];

// ─── Public Routes ──────────────────────────────────────────

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// ─── Admin-Only Routes ──────────────────────────────────────

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  createProductValidation,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  updateProductValidation,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteProduct
);

module.exports = router;
