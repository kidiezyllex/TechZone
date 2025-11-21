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

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm (tìm kiếm, filter, phân trang)
 *     tags: [2. Products - Quản lý Sản Phẩm]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: brand_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/best-sellers:
 *   get:
 *     summary: Lấy danh sách sản phẩm bán chạy
 *     tags: [2. Products - Quản lý Sản Phẩm]
 *     responses:
 *       200:
 *         description: Top sản phẩm bán chạy
 */
router.get('/best-sellers', getBestSellers);

/**
 * @swagger
 * /api/products/new-products:
 *   get:
 *     summary: Lấy danh sách sản phẩm mới
 *     tags: [2. Products - Quản lý Sản Phẩm]
 *     responses:
 *       200:
 *         description: Sản phẩm mới nhất
 */
router.get('/new-products', getNewProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [2. Products - Quản lý Sản Phẩm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới (Admin/Staff)
 *     tags: [2. Products - Quản lý Sản Phẩm]
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
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               brand_id:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sản phẩm được tạo thành công
 */
router.post('/', authenticate, authorize(['Admin', 'Staff']), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm (Admin/Staff)
 *     tags: [2. Products - Quản lý Sản Phẩm]
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
 *         description: Sản phẩm được cập nhật
 */
router.put('/:id', authenticate, authorize(['Admin', 'Staff']), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm (Admin/Staff)
 *     tags: [2. Products - Quản lý Sản Phẩm]
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
 *         description: Sản phẩm được xóa
 */
router.delete('/:id', authenticate, authorize(['Admin', 'Staff']), deleteProduct);

export default router;
