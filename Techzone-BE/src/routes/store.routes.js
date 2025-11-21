import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as storeController from '../controllers/store.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/stores/dropdown:
 *   get:
 *     summary: Lấy danh sách cửa hàng cho dropdown
 *     tags: [6. Stores - Quản lý Cửa Hàng]
 *     responses:
 *       200:
 *         description: Danh sách cửa hàng
 */
router.get('/dropdown', storeController.getStoresForDropdown);

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Lấy danh sách cửa hàng (Admin)
 *     tags: [6. Stores - Quản lý Cửa Hàng]
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
 *     responses:
 *       200:
 *         description: Danh sách cửa hàng
 */
router.get('/', authenticate, authorize(['Admin']), storeController.getStores);

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Lấy chi tiết cửa hàng (Admin)
 *     tags: [6. Stores - Quản lý Cửa Hàng]
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
 *         description: Chi tiết cửa hàng
 */
router.get('/:id', authenticate, authorize(['Admin']), storeController.getStoreDetail);

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Tạo cửa hàng mới (Admin)
 *     tags: [6. Stores - Quản lý Cửa Hàng]
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
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cửa hàng được tạo
 */
router.post('/', authenticate, authorize(['Admin']), storeController.createStore);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Cập nhật cửa hàng (Admin)
 *     tags: [6. Stores - Quản lý Cửa Hàng]
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
 *         description: Cửa hàng được cập nhật
 */
router.put('/:id', authenticate, authorize(['Admin']), storeController.updateStore);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Xóa cửa hàng (Admin)
 *     tags: [6. Stores - Quản lý Cửa Hàng]
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
 *         description: Cửa hàng được xóa
 */
router.delete('/:id', authenticate, authorize(['Admin']), storeController.deleteStore);

export default router;
