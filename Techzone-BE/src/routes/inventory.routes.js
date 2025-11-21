import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as inventoryController from '../controllers/inventory.controller.js';

const router = express.Router();

// Middleware: Admin/Manager only
const adminManager = [authenticate, authorize(['Admin', 'Manager', 'Staff'])];

router.get('/by-store', adminManager, inventoryController.getInventoryByStore);
router.get('/logs', adminManager, inventoryController.getInventoryLogs);
router.get('/low-stock', adminManager, inventoryController.getLowStockProducts);
router.post('/import', adminManager, inventoryController.importInventory);
router.post('/export', adminManager, inventoryController.exportInventory);

export default router;
