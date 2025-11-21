import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as inventoryController from '../controllers/inventory.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/inventory/by-store:
 *   get:
 *     summary: Lấy danh sách kho theo chi nhánh
 *     tags: [4. Inventory - Quản lý Kho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         required: true
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
 *     responses:
 *       200:
 *         description: Danh sách kho
 */
router.get('/by-store', authenticate, authorize(['Admin', 'Manager', 'Staff']), inventoryController.getInventoryByStore);

/**
 * @swagger
 * /api/inventory/import:
 *   post:
 *     summary: Nhập kho
 *     tags: [4. Inventory - Quản lý Kho]
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
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               supplier_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Nhập kho thành công
 */
router.post('/import', authenticate, authorize(['Admin', 'Manager', 'Staff']), inventoryController.importInventory);

/**
 * @swagger
 * /api/inventory/export:
 *   post:
 *     summary: Xuất kho
 *     tags: [4. Inventory - Quản lý Kho]
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
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Xuất kho thành công
 */
router.post('/export', authenticate, authorize(['Admin', 'Manager', 'Staff']), inventoryController.exportInventory);

/**
 * @swagger
 * /api/inventory/logs:
 *   get:
 *     summary: Lấy lịch sử nhập/xuất kho
 *     tags: [4. Inventory - Quản lý Kho]
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
 *     responses:
 *       200:
 *         description: Lịch sử kho
 */
router.get('/logs', authenticate, authorize(['Admin', 'Manager', 'Staff']), inventoryController.getInventoryLogs);

/**
 * @swagger
 * /api/inventory/low-stock:
 *   get:
 *     summary: Lấy danh sách sản phẩm cần nhập kho (stock thấp)
 *     tags: [4. Inventory - Quản lý Kho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm cần nhập
 */
router.get('/low-stock', authenticate, authorize(['Admin', 'Manager', 'Staff']), inventoryController.getLowStockProducts);

export default router;
