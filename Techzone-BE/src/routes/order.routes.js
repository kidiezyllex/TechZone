import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

const createOrderValidator = [
  body('store_id').isInt().withMessage('Store ID không hợp lệ'),
  body('shipping_address').trim().notEmpty().withMessage('Địa chỉ giao hàng không được để trống'),
  body('shipping_city').trim().notEmpty().withMessage('Thành phố không được để trống'),
  body('shipping_district').trim().notEmpty().withMessage('Quận/Huyện không được để trống'),
  body('phone').matches(/^(0|\+84)[0-9]{9}$/).withMessage('Số điện thoại không hợp lệ'),
  body('payment_method').isIn(['cod', 'bank_transfer', 'momo', 'zalopay']).withMessage('Phương thức thanh toán không hợp lệ')
];

// Customer routes
router.post('/', authenticate, createOrderValidator, validate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/cancel', authenticate, cancelOrder);

// Admin/Staff routes
router.get('/all/list', authenticate, authorize('admin', 'staff'), getAllOrders);
router.put('/:id/status', authenticate, authorize('admin', 'staff'), updateOrderStatus);

export default router;
