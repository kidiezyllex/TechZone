import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới (Checkout)
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_id:
 *                 type: integer
 *               shipping_address:
 *                 type: string
 *               shipping_city:
 *                 type: string
 *               shipping_district:
 *                 type: string
 *               phone:
 *                 type: string
 *               payment_method:
 *                 type: string
 *                 enum: [cod, bank_transfer, momo, zalopay]
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 */
router.post('/', authenticate, createOrder);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng hiện tại
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
 *     security:
 *       - bearerAuth: []
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
 *           default: 20
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get('/my-orders', authenticate, getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
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
 *         description: Chi tiết đơn hàng
 */
router.get('/:id', authenticate, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Hủy đơn hàng
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
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
 *         description: Đơn hàng được hủy
 */
router.put('/:id/cancel', authenticate, cancelOrder);

/**
 * @swagger
 * /api/orders/all/list:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng (Admin/Staff)
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get('/all/list', authenticate, authorize(['Admin', 'Staff']), getAllOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng (Admin/Staff)
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed, cancelled]
 *     responses:
 *       200:
 *         description: Trạng thái đơn hàng được cập nhật
 */
router.put('/:id/status', authenticate, authorize(['Admin', 'Staff']), updateOrderStatus);
router.patch('/:id/status', authenticate, authorize(['Admin', 'Staff']), updateOrderStatus);

export default router;
