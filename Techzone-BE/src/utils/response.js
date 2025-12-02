// Standardized API Response Helper

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

export const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  // Đảm bảo total là số hợp lệ
  const totalCount = parseInt(total) || 0;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      totalPages: limitNum > 0 ? Math.ceil(totalCount / limitNum) : 0
    }
  });
};
