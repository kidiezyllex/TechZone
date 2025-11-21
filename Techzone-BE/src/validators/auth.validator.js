import { body } from 'express-validator';

// Validator cho đăng ký
export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu phải chứa chữ hoa, chữ thường và số'),
  
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Họ tên phải từ 2-255 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^(0|\+84)[0-9]{9}$/)
    .withMessage('Số điện thoại không hợp lệ')
];

// Validator cho đăng nhập
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
];

// Validator cho verify OTP
export const verifyOTPValidator = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('Mã OTP phải có 6 số')
    .isNumeric()
    .withMessage('Mã OTP chỉ chứa số')
];

// Validator cho request OTP
export const requestOTPValidator = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('type')
    .optional()
    .isIn(['register', 'reset_password', 'verify'])
    .withMessage('Loại OTP không hợp lệ')
];

// Validator cho reset password
export const resetPasswordValidator = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('Mã OTP phải có 6 số'),
  
  body('new_password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu phải chứa chữ hoa, chữ thường và số')
];

// Validator cho update profile
export const updateProfileValidator = [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Họ tên phải từ 2-255 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^(0|\+84)[0-9]{9}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('URL avatar không hợp lệ')
];
