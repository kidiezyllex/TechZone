import rateLimit from 'express-rate-limit';

// Rate limiter cho login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 lần thử
  message: {
    success: false,
    message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho OTP
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // Tối đa 3 lần gửi OTP
  message: {
    success: false,
    message: 'Quá nhiều lần gửi OTP. Vui lòng thử lại sau 1 giờ'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter chung cho API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 requests
  message: {
    success: false,
    message: 'Quá nhiều requests. Vui lòng thử lại sau'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
