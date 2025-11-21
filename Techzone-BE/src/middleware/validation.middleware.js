import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

// Middleware xử lý validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return errorResponse(res, 'Dữ liệu không hợp lệ', 400, formattedErrors);
  }
  
  next();
};
