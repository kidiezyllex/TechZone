import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/request-register-otp:
 *   post:
 *     summary: Gửi OTP cho đăng ký tài khoản
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: OTP đã được gửi thành công
 *       400:
 *         description: Email không hợp lệ
 */
router.post('/request-register-otp', authController.requestRegisterOTP);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới (xác thực OTP)
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công, trả về token
 *       400:
 *         description: OTP không hợp lệ hoặc hết hạn
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
 *       401:
 *         description: Email hoặc password không chính xác
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Lấy thông tin cá nhân người dùng
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Chưa xác thực
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   post:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.post('/profile', authenticate, authController.updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
router.post('/change-password', authenticate, authController.changePassword);

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Gửi OTP để đặt lại mật khẩu
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP đã được gửi
 */
router.post('/request-password-reset', authController.requestPasswordReset);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu với OTP
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Làm mới access token
 *     tags: [1. Authentication - Quản lý Tài Khoản]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token mới được cấp
 *       401:
 *         description: Refresh token không hợp lệ
 */
router.post('/refresh-token', authController.refreshToken);

export default router;
