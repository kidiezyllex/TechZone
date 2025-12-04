import { query } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { ValidationError } from '../utils/errors.js';

// LẤY DANH SÁCH CỬA HÀNG
export const getStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, is_active } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM stores WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR address LIKE ? OR city LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(is_active === 'true');
    }

    const countSql = 'SELECT COUNT(*) as total FROM stores WHERE 1=1' +
      (search ? ' AND (name LIKE ? OR address LIKE ? OR city LIKE ?)' : '') +
      (is_active !== undefined ? ' AND is_active = ?' : '');
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    sql += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const data = await query(sql, params);

    return paginatedResponse(res, data, page, limit, total, 'Lấy danh sách cửa hàng thành công');
  } catch (error) {
    next(error);
  }
};

// TẠO CỬA HÀNG
export const createStore = async (req, res, next) => {
  try {
    const { name, address, city, district, phone, manager_id, is_active, email, google_maps_url } = req.body;

    if (!name || !address || !city) {
      return errorResponse(res, 'Thông tin không đầy đủ', 400);
    }

    const result = await query(
      'INSERT INTO stores (name, address, city, phone, email, google_maps_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        address,
        city,
        phone || null,
        email || null,
        google_maps_url || null,
        is_active ?? true
      ]
    );

    const [store] = await query('SELECT * FROM stores WHERE id = ?', [result.insertId]);

    return successResponse(res, store, 'Tạo cửa hàng thành công', 201);
  } catch (error) {
    next(error);
  }
};

// CẬP NHẬT CỬA HÀNG
export const updateStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, city, district, phone, manager_id, is_active } = req.body;

    let sql = 'UPDATE stores SET ';
    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (address) {
      updates.push('address = ?');
      params.push(address);
    }
    if (city) {
      updates.push('city = ?');
      params.push(city);
    }
    if (district !== undefined) {
      updates.push('district = ?');
      params.push(district);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (manager_id !== undefined) {
      updates.push('manager_id = ?');
      params.push(manager_id);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(is_active);
    }

    if (updates.length === 0) {
      return errorResponse(res, 'Không có dữ liệu để cập nhật', 400);
    }

    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await query(sql, params);
    const [store] = await query('SELECT * FROM stores WHERE id = ?', [id]);

    return successResponse(res, store, 'Cập nhật cửa hàng thành công');
  } catch (error) {
    next(error);
  }
};

// XÓA CỬA HÀNG
export const deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('UPDATE stores SET is_active = FALSE WHERE id = ?', [id]);

    return successResponse(res, { id }, 'Xóa cửa hàng thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY CHI TIẾT CỬA HÀNG
export const getStoreDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT s.*, u.full_name as manager_name,
             (SELECT COUNT(*) FROM inventory WHERE store_id = s.id) as total_products,
             (SELECT COUNT(*) FROM staff_roles WHERE store_id = s.id) as total_staff,
             (SELECT COUNT(*) FROM orders WHERE store_id = s.id) as total_orders,
             (SELECT SUM(quantity) FROM inventory WHERE store_id = s.id) as total_inventory
      FROM stores s
      LEFT JOIN users u ON s.manager_id = u.id
      WHERE s.id = ?
    `;

    const [data] = await query(sql, [id]);

    if (!data) {
      return errorResponse(res, 'Cửa hàng không tồn tại', 404);
    }

    return successResponse(res, data, 'Lấy chi tiết cửa hàng thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY DANH SÁCH CỬA HÀNG (cho dropdown, minimal data)
export const getStoresForDropdown = async (req, res, next) => {
  try {
    const data = await query('SELECT id, name FROM stores WHERE is_active = TRUE ORDER BY name');

    return successResponse(res, data, 'Lấy danh sách cửa hàng thành công');
  } catch (error) {
    next(error);
  }
};
