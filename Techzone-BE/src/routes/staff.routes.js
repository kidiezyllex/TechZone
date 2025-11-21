import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as staffController from '../controllers/staff.controller.js';

const router = express.Router();

// Middleware: Admin/Manager only
const adminManager = [authenticate, authorize(['Admin', 'Manager'])];

router.get('/', adminManager, staffController.getStaff);
router.get('/:id', adminManager, staffController.getStaffDetail);
router.post('/', adminManager, staffController.createStaff);
router.put('/:id', adminManager, staffController.updateStaff);
router.delete('/:id', adminManager, staffController.deleteStaff);

export default router;
