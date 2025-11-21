import express from 'express';
import {
  requestRegisterOTP,
  register,
  login,
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  changePassword
} from '../controllers/auth.controller.js';
import {
  registerValidator,
  loginValidator,
  verifyOTPValidator,
  requestOTPValidator,
  resetPasswordValidator,
  updateProfileValidator
} from '../validators/auth.validator.js';
import { validate } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { loginLimiter, otpLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Public routes
router.post('/request-register-otp', otpLimiter, requestOTPValidator, validate, requestRegisterOTP);
router.post('/register', registerValidator, verifyOTPValidator, validate, register);
router.post('/login', loginLimiter, loginValidator, validate, login);
router.post('/request-password-reset', otpLimiter, requestOTPValidator, validate, requestPasswordReset);
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidator, validate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
