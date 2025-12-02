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

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách danh mục sản phẩm
 *     tags: [2. Products - Quản lý Danh Mục]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/categories/brands/all:
 *   get:
 *     summary: Lấy danh sách tất cả thương hiệu
 *     tags: [2. Products - Quản lý Danh Mục]
 *     responses:
 *       200:
 *         description: Danh sách thương hiệu
 */
router.get('/brands/all', getAllBrands);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục
 *     tags: [2. Products - Quản lý Danh Mục]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết danh mục
 */
router.get('/:id', getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo danh mục mới (Admin)
 *     tags: [2. Products - Quản lý Danh Mục]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Danh mục được tạo
 */
router.post('/', authenticate, authorize(['Admin']), createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục (Admin)
 *     tags: [2. Products - Quản lý Danh Mục]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Danh mục được cập nhật
 */
router.put('/:id', authenticate, authorize(['Admin']), updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (Admin)
 *     tags: [2. Products - Quản lý Danh Mục]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh mục được xóa
 */
router.delete('/:id', authenticate, authorize(['Admin']), deleteCategory);

/**
 * @swagger
 * /api/categories/brands:
 *   post:
 *     summary: Tạo thương hiệu mới (Admin)
 *     tags: [2. Products - Quản lý Danh Mục]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thương hiệu được tạo
 */
router.post('/brands', authenticate, authorize(['Admin']), createBrand);

/**
 * @swagger
 * /api/categories/brands/{id}:
 *   put:
 *     summary: Cập nhật thương hiệu (Admin)
 *     tags: [2. Products - Quản lý Danh Mục]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Thương hiệu được cập nhật
 */
router.put('/brands/:id', authenticate, authorize(['Admin']), updateBrand);

export default router;
