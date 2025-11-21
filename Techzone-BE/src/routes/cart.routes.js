import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy thông tin giỏ hàng của người dùng
 *     tags: [3. Cart & Orders - Quản lý Giỏ Hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giỏ hàng của người dùng
 */
router.get('/', authenticate, getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [3. Cart & Orders - Quản lý Giỏ Hàng]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sản phẩm thêm vào giỏ thành công
 */
router.post('/add', authenticate, addToCart);

/**
 * @swagger
 * /api/cart/items/{item_id}:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ
 *     tags: [3. Cart & Orders - Quản lý Giỏ Hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật số lượng thành công
 */
router.put('/items/:item_id', authenticate, updateCartItem);

/**
 * @swagger
 * /api/cart/items/{item_id}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [3. Cart & Orders - Quản lý Giỏ Hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 */
router.delete('/items/:item_id', authenticate, removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Xóa toàn bộ giỏ hàng
 *     tags: [3. Cart & Orders - Quản lý Giỏ Hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giỏ hàng được xóa
 */
router.delete('/clear', authenticate, clearCart);

export default router;
