import { errorResponse } from '../utils/response.js';

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // MySQL errors
  if (err.code && err.code.startsWith('ER_')) {
    if (err.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Dữ liệu đã tồn tại', 409);
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return errorResponse(res, 'Dữ liệu tham chiếu không tồn tại', 400);
    }
    return errorResponse(res, 'Lỗi cơ sở dữ liệu', 500);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Token không hợp lệ', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token đã hết hạn', 401);
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, err.message, 400);
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Đã xảy ra lỗi';
  
  return errorResponse(res, message, statusCode);
};

// 404 handler
export const notFound = (req, res) => {
  return errorResponse(res, `Không tìm thấy route: ${req.originalUrl}`, 404);
};
