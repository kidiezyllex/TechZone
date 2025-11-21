import { query } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

// LẤY DANH SÁCH KHÁCH HÀNG
export const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, sort_by = 'total_spent', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT c.*, u.email, u.full_name, u.phone
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (u.email LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const countSql = sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    const validSort = ['total_spent', 'total_orders', 'created_at', 'last_order_date'];
    const sortField = validSort.includes(sort_by) ? sort_by : 'total_spent';

    sql += ` ORDER BY c.${sortField} ${order === 'ASC' ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [data] = await query(sql, params);

    return paginatedResponse(res, data, page, limit, total, 'Lấy danh sách khách hàng thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY CHI TIẾT KHÁCH HÀNG
export const getCustomerDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT c.*, u.email, u.full_name, u.phone, u.created_at,
             (SELECT COUNT(*) FROM orders WHERE user_id = c.user_id) as order_count,
             (SELECT COUNT(*) FROM orders WHERE user_id = c.user_id AND status = 'completed') as completed_orders
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;

    const [customer] = await query(sql, [id]);

    if (!customer) {
      return errorResponse(res, 'Khách hàng không tồn tại', 404);
    }

    // Lấy lịch sử đơn hàng
    const [orders] = await query(
      `SELECT o.id, o.total_amount, o.status, o.created_at
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC
       LIMIT 10`,
      [customer.user_id]
    );

    return successResponse(res, { ...customer, recent_orders: orders }, 'Lấy chi tiết khách hàng thành công');
  } catch (error) {
    next(error);
  }
};

// CẬP NHẬT THÔNG TIN KHÁCH HÀNG (classification, notes)
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { classification, notes } = req.body;

    let sql = 'UPDATE customers SET ';
    const updates = [];
    const params = [];

    if (classification) {
      updates.push('classification = ?');
      params.push(classification);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length === 0) {
      return errorResponse(res, 'Không có dữ liệu để cập nhật', 400);
    }

    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await query(sql, params);
    const [customer] = await query('SELECT * FROM customers WHERE id = ?', [id]);

    return successResponse(res, customer, 'Cập nhật khách hàng thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY DANH SÁCH KHÁCH HÀNG VIP (top spenders)
export const getVIPCustomers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const sql = `
      SELECT c.*, u.email, u.full_name, u.phone
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.total_spent > 0
      ORDER BY c.total_spent DESC
      LIMIT ?
    `;

    const [data] = await query(sql, [limit]);

    return successResponse(res, data, 'Lấy danh sách khách hàng VIP thành công');
  } catch (error) {
    next(error);
  }
};

// PHÂN LOẠI KHÁCH HÀNG
export const classifyCustomers = async (req, res, next) => {
  try {
    // Cập nhật classification dựa trên total_spent
    await query(`
      UPDATE customers SET classification = CASE
        WHEN total_spent >= 50000000 THEN 'Platinum'
        WHEN total_spent >= 20000000 THEN 'Gold'
        WHEN total_spent >= 5000000 THEN 'Silver'
        ELSE 'Bronze'
      END
    `);

    return successResponse(res, { success: true }, 'Phân loại khách hàng thành công');
  } catch (error) {
    next(error);
  }
};
