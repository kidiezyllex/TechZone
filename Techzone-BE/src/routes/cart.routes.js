import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Tất cả routes cần authentication
router.use(authenticate);

const addToCartValidator = [
  body('product_id').isInt().withMessage('Product ID không hợp lệ'),
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0')
];

const updateCartValidator = [
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0')
];

router.get('/', getCart);
router.post('/add', addToCartValidator, validate, addToCart);
router.put('/items/:item_id', updateCartValidator, validate, updateCartItem);
router.delete('/items/:item_id', removeFromCart);
router.delete('/clear', clearCart);

export default router;
