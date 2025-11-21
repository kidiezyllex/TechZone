import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as customerController from '../controllers/customer.controller.js';

const router = express.Router();

// Middleware: Admin/Manager only
const adminManager = [authenticate, authorize(['Admin', 'Manager', 'Staff'])];

router.get('/', adminManager, customerController.getCustomers);
router.get('/vip/list', adminManager, customerController.getVIPCustomers);
router.get('/:id', adminManager, customerController.getCustomerDetail);
router.put('/:id', adminManager, customerController.updateCustomer);
router.post('/classify', [authenticate, authorize(['Admin', 'Manager'])], customerController.classifyCustomers);

export default router;
