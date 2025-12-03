import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách users (Staff và Customer)
 *     tags: [8. Users - Quản lý Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role_id
 *         schema:
 *           type: integer
 *           description: 2 = Staff, 3 = Customer
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
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
 *           enum: [created_at, full_name, email, total_spent, total_orders]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: Danh sách users
 */
router.get('/', authenticate, authorize(['Admin', 'Manager', 'Staff']), userController.getUsers);

/**
 * @swagger
 * /api/users/vip:
 *   get:
 *     summary: Lấy danh sách khách hàng VIP (top spenders)
 *     tags: [8. Users - Quản lý Users]
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
router.get('/vip', authenticate, authorize(['Admin', 'Manager', 'Staff']), userController.getVIPCustomers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy chi tiết user
 *     tags: [8. Users - Quản lý Users]
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
 *         description: Chi tiết user
 */
router.get('/:id', authenticate, authorize(['Admin', 'Manager', 'Staff']), userController.getUserDetail);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tạo user mới (Staff hoặc Customer)
 *     tags: [8. Users - Quản lý Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - full_name
 *               - role_id
 *             properties:
 *               email:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               role_id:
 *                 type: integer
 *                 enum: [2, 3]
 *                 description: 2 = Staff, 3 = Customer
 *               password:
 *                 type: string
 *               store_id:
 *                 type: integer
 *                 description: Bắt buộc nếu role_id = 2
 *     responses:
 *       201:
 *         description: User được tạo
 */
router.post('/', authenticate, authorize(['Admin', 'Manager']), userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin user
 *     tags: [8. Users - Quản lý Users]
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
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               store_id:
 *                 type: integer
 *                 description: Chỉ áp dụng cho Staff (role_id = 2)
 *               classification:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: User được cập nhật
 */
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa user (soft delete)
 *     tags: [8. Users - Quản lý Users]
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
 *         description: User được xóa
 */
router.delete('/:id', authenticate, authorize(['Admin', 'Manager']), userController.deleteUser);

/**
 * @swagger
 * /api/users/classify:
 *   post:
 *     summary: Phân loại tất cả khách hàng theo chi tiêu
 *     tags: [8. Users - Quản lý Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Phân loại thành công
 */
router.post('/classify', authenticate, authorize(['Admin', 'Manager']), userController.classifyCustomers);

export default router;

