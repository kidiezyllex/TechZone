import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBestSellers,
  getNewProducts
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Validators
const createProductValidator = [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Tên sản phẩm từ 2-255 ký tự'),
  body('sku').trim().isLength({ min: 2 }).withMessage('SKU không được để trống'),
  body('category_id').isInt().withMessage('Category ID không hợp lệ'),
  body('brand_id').isInt().withMessage('Brand ID không hợp lệ'),
  body('price').isFloat({ min: 0 }).withMessage('Giá phải lớn hơn 0')
];

// Public routes
router.get('/', getProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-products', getNewProducts);
router.get('/:id', getProductById);

// Protected routes (Admin/Staff only)
router.post('/', authenticate, authorize('admin', 'staff'), createProductValidator, validate, createProduct);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateProduct);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteProduct);

export default router;
