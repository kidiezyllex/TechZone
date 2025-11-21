import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as statsController from '../controllers/stats.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     summary: Lấy thống kê dashboard (tổng quan)
 *     tags: [8. Statistics - Thống Kê & Báo Cáo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Thống kê dashboard
 */
router.get('/dashboard', authenticate, authorize(['Admin', 'Manager', 'Staff']), statsController.getDashboardStats);

/**
 * @swagger
 * /api/stats/revenue/by-store:
 *   get:
 *     summary: Báo cáo doanh thu theo chi nhánh
 *     tags: [8. Statistics - Thống Kê & Báo Cáo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doanh thu theo từng chi nhánh
 */
router.get('/revenue/by-store', authenticate, authorize(['Admin', 'Manager', 'Staff']), statsController.getRevenueByStore);

/**
 * @swagger
 * /api/stats/revenue/by-category:
 *   get:
 *     summary: Báo cáo doanh thu theo danh mục
 *     tags: [8. Statistics - Thống Kê & Báo Cáo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doanh thu theo từng danh mục sản phẩm
 */
router.get('/revenue/by-category', authenticate, authorize(['Admin', 'Manager', 'Staff']), statsController.getRevenueByCategory);

/**
 * @swagger
 * /api/stats/revenue/over-time:
 *   get:
 *     summary: Báo cáo doanh thu theo thời gian
 *     tags: [8. Statistics - Thống Kê & Báo Cáo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doanh thu theo thời gian
 */
router.get('/revenue/over-time', authenticate, authorize(['Admin', 'Manager', 'Staff']), statsController.getRevenueOverTime);

/**
 * @swagger
 * /api/stats/orders/by-status:
 *   get:
 *     summary: Báo cáo đơn hàng theo trạng thái
 *     tags: [8. Statistics - Thống Kê & Báo Cáo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đơn hàng theo trạng thái
 */
router.get('/orders/by-status', authenticate, authorize(['Admin', 'Manager', 'Staff']), statsController.getOrdersByStatus);

/**
 * @swagger
 * /api/stats/export:
 *   get:
 *     summary: Xuất báo cáo (JSON có thể convert sang Excel)
 *     tags: [8. Statistics - Thống Kê & Báo Cáo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: report_type
 *         schema:
 *           type: string
 *           enum: [sales, inventory]
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dữ liệu báo cáo để export
 */
router.get('/export', authenticate, authorize(['Admin', 'Manager', 'Staff']), statsController.exportReport);

export default router;
