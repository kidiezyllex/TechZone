import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import { query } from '../config/database.config.js';

// Middleware xác thực JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Không tìm thấy token xác thực', 401);
    }
    
    const token = authHeader.substring(7); // Bỏ "Bearer "
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Lấy thông tin user từ database
    const [user] = await query(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ? AND u.is_active = TRUE`,
      [decoded.userId]
    );
    
    if (!user) {
      return errorResponse(res, 'Người dùng không tồn tại hoặc đã bị khóa', 401);
    }
    
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Token không hợp lệ hoặc đã hết hạn', 401);
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Chưa xác thực', 401);
    }
    
    const rolesArray = allowedRoles.flat().filter(role => typeof role === 'string');
    
    const userRole = req.user.role_name?.toLowerCase();
    const normalizedAllowedRoles = rolesArray.map(role => role.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      return errorResponse(res, 'Bạn không có quyền truy cập', 403);
    }
    
    next();
  };
};

export const checkOwnership = (userIdField = 'user_id') => {
  return (req, res, next) => {
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    // So sánh case-insensitive
    if (req.user.role_name?.toLowerCase() === 'admin') {
      return next();
    }
    
    if (parseInt(resourceUserId) !== parseInt(req.user.id)) {
      return errorResponse(res, 'Bạn không có quyền truy cập tài nguyên này', 403);
    }
    
    next();
  };
};
