import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as customerController from '../controllers/customer.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Lấy danh sách khách hàng
 *     tags: [7. Customers - Quản lý Khách Hàng]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [total_spent, total_orders, created_at]
 *     responses:
 *       200:
 *         description: Danh sách khách hàng
 */
router.get('/', authenticate, authorize(['Admin', 'Manager', 'Staff']), customerController.getCustomers);

/**
 * @swagger
 * /api/customers/vip/list:
 *   get:
 *     summary: Lấy danh sách khách hàng VIP (top spenders)
 *     tags: [7. Customers - Quản lý Khách Hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách khách hàng VIP
 */
router.get('/vip/list', authenticate, authorize(['Admin', 'Manager', 'Staff']), customerController.getVIPCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Lấy chi tiết khách hàng
 *     tags: [7. Customers - Quản lý Khách Hàng]
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
 *         description: Chi tiết khách hàng
 */
router.get('/:id', authenticate, authorize(['Admin', 'Manager', 'Staff']), customerController.getCustomerDetail);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Cập nhật thông tin khách hàng (ghi chú, phân loại)
 *     tags: [7. Customers - Quản lý Khách Hàng]
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
 *               classification:
 *                 type: string
 *                 enum: [Platinum, Gold, Silver, Bronze]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Khách hàng được cập nhật
 */
router.put('/:id', authenticate, authorize(['Admin', 'Manager', 'Staff']), customerController.updateCustomer);

/**
 * @swagger
 * /api/customers/classify:
 *   post:
 *     summary: Phân loại tất cả khách hàng theo chi tiêu
 *     tags: [7. Customers - Quản lý Khách Hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Phân loại thành công
 */
router.post('/classify', authenticate, authorize(['Admin', 'Manager']), customerController.classifyCustomers);

export default router;
