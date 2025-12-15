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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - subTotal
 *               - total
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: Mã đơn hàng (tự động tạo nếu không có)
 *               email:
 *                 type: string
 *                 description: Email khách hàng (bắt buộc nếu không có xác thực)
 *               name:
 *                 type: string
 *                 description: Tên khách hàng
 *               phoneNumber:
 *                 type: string
 *                 description: Số điện thoại khách hàng
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               subTotal:
 *                 type: number
 *               discount:
 *                 type: number
 *               total:
 *                 type: number
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   provinceId:
 *                     type: string
 *                   districtId:
 *                     type: string
 *                   wardId:
 *                     type: string
 *                   specificAddress:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, cod, online]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 */
router.post('/', createOrder);

/**
 * @swagger
 * /api/orders/my-orders:
 *   post:
 *     summary: Lấy danh sách đơn hàng theo email
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               page:
 *                 type: integer
 *                 default: 1
 *               limit:
 *                 type: integer
 *                 default: 10
 *               status:
 *                 type: string
 *                 description: Lọc theo trạng thái đơn hàng
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.post('/my-orders', getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [3. Cart & Orders - Quản lý Đơn Hàng]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email khách hàng (bắt buộc nếu không đăng nhập)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 */
router.get('/:id', getOrderById);

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
router.patch('/:id/cancel', authenticate, cancelOrder);

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
