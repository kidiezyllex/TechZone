import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as staffController from '../controllers/staff.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Lấy danh sách nhân viên
 *     tags: [5. Staff - Quản lý Nhân Viên]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Danh sách nhân viên
 */
router.get('/', authenticate, authorize(['Admin', 'Manager']), staffController.getStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Lấy chi tiết nhân viên
 *     tags: [5. Staff - Quản lý Nhân Viên]
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
 *         description: Chi tiết nhân viên
 */
router.get('/:id', authenticate, authorize(['Admin', 'Manager']), staffController.getStaffDetail);

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Tạo nhân viên mới
 *     tags: [5. Staff - Quản lý Nhân Viên]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               store_id:
 *                 type: integer
 *               position:
 *                 type: string
 *     responses:
 *       201:
 *         description: Nhân viên được tạo
 */
router.post('/', authenticate, authorize(['Admin', 'Manager']), staffController.createStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Cập nhật thông tin nhân viên
 *     tags: [5. Staff - Quản lý Nhân Viên]
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
 *         description: Nhân viên được cập nhật
 */
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), staffController.updateStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Xóa nhân viên
 *     tags: [5. Staff - Quản lý Nhân Viên]
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
 *         description: Nhân viên được xóa
 */
router.delete('/:id', authenticate, authorize(['Admin', 'Manager']), staffController.deleteStaff);

export default router;
