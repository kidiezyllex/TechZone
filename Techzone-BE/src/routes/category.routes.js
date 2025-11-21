import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBrands,
  createBrand,
  updateBrand
} from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Category validators
const categoryValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Tên danh mục từ 2-100 ký tự')
];

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/brands/all', getAllBrands);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('admin'), categoryValidator, validate, createCategory);
router.put('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);
router.post('/brands', authenticate, authorize('admin'), createBrand);
router.put('/brands/:id', authenticate, authorize('admin'), updateBrand);

export default router;
