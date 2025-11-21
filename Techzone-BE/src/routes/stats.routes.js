import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as statsController from '../controllers/stats.controller.js';

const router = express.Router();

// Middleware: Admin/Manager/Staff can access
const adminManagerStaff = [authenticate, authorize(['Admin', 'Manager', 'Staff'])];

router.get('/dashboard', adminManagerStaff, statsController.getDashboardStats);
router.get('/revenue/by-store', adminManagerStaff, statsController.getRevenueByStore);
router.get('/revenue/by-category', adminManagerStaff, statsController.getRevenueByCategory);
router.get('/revenue/over-time', adminManagerStaff, statsController.getRevenueOverTime);
router.get('/orders/by-status', adminManagerStaff, statsController.getOrdersByStatus);
router.get('/export', adminManagerStaff, statsController.exportReport);

export default router;
