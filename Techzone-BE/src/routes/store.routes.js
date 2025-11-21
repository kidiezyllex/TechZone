import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as storeController from '../controllers/store.controller.js';

const router = express.Router();

// Public routes
router.get('/dropdown', storeController.getStoresForDropdown);

// Admin only
const admin = [authenticate, authorize(['Admin'])];

router.get('/', admin, storeController.getStores);
router.get('/:id', admin, storeController.getStoreDetail);
router.post('/', admin, storeController.createStore);
router.put('/:id', admin, storeController.updateStore);
router.delete('/:id', admin, storeController.deleteStore);

export default router;
