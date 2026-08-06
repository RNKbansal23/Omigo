// ─── Product Controller (no Redis caching) ──────────────────
const { prisma } = require('../config/db');
const { validationResult } = require('express-validator');

/**
 * GET /api/products
 * Fetch all active products with pagination, search, and category filter.
 */
async function getAllProducts(req, res, next) {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      sortBy = 'createdAt',
      order = 'desc',
      minPrice,
      maxPrice,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Validate sort field
    const allowedSortFields = ['createdAt', 'price', 'name', 'stock'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeOrder = order === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [safeSortBy]: safeOrder },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:id
 * Fetch a single product by ID.
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products  (Admin only)
 * Create a new product.
 */
async function createProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array(),
      });
    }

    const { name, description, price, images, category, stock } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        images: images || [],
        category,
        stock: parseInt(stock, 10) || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/products/:id  (Admin only)
 * Update an existing product.
 */
async function updateProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { name, description, price, images, category, stock, isActive } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (isActive !== undefined) updateData.isActive = isActive;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id  (Admin only)
 * Soft-delete a product by marking it inactive.
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
