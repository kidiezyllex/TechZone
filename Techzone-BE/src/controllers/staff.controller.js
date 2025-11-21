import { query, transaction } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors.js';

// LẤY DANH SÁCH NHÂN VIÊN
export const getStaff = async (req, res, next) => {
  try {
    const { store_id, role_id, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT u.id, u.email, u.full_name, u.phone, r.name as role, u.is_active, u.created_at,
             s.name as store_name, sr.position, sr.hire_date, sr.salary
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN staff_roles sr ON u.id = sr.user_id
      LEFT JOIN stores s ON sr.store_id = s.id
      WHERE u.role_id IN (2, 3)
    `;
    const params = [];

    if (store_id) {
      sql += ' AND sr.store_id = ?';
      params.push(store_id);
    }
    if (role_id) {
      sql += ' AND u.role_id = ?';
      params.push(role_id);
    }
    if (search) {
      sql += ' AND (u.email LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const countSql = sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [data] = await query(sql, params);

    return paginatedResponse(res, data, page, limit, total, 'Lấy danh sách nhân viên thành công');
  } catch (error) {
    next(error);
  }
};

// TẠO NHÂN VIÊN
export const createStaff = async (req, res, next) => {
  try {
    const { email, full_name, phone, role_id, store_id, position, hire_date, salary } = req.body;

    if (!email || !full_name || !role_id || !store_id) {
      return errorResponse(res, 'Thông tin không đầy đủ', 400);
    }

    const result = await transaction(async (conn) => {
      // Kiểm tra email tồn tại
      const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing) {
        throw new ConflictError('Email đã tồn tại');
      }

      // Tạo user
      const tempPassword = Math.random().toString(36).slice(2, 10);
      const hashedPassword = await hashPassword(tempPassword);

      const [userResult] = await conn.execute(
        'INSERT INTO users (email, password, full_name, phone, role_id, is_active) VALUES (?, ?, ?, ?, ?, TRUE)',
        [email, hashedPassword, full_name, phone || null, role_id]
      );

      // Gán staff role
      await conn.execute(
        'INSERT INTO staff_roles (user_id, store_id, position, hire_date, salary) VALUES (?, ?, ?, ?, ?)',
        [userResult.insertId, store_id, position || 'Staff', hire_date || new Date(), salary || 0]
      );

      return {
        id: userResult.insertId,
        email,
        full_name,
        temporary_password: tempPassword
      };
    });

    return successResponse(res, result, 'Tạo nhân viên thành công', 201);
  } catch (error) {
    if (error instanceof ConflictError) {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

// CẬP NHẬT NHÂN VIÊN
export const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, phone, position, salary, is_active } = req.body;

    const result = await transaction(async (conn) => {
      // Cập nhật user info
      if (full_name || phone !== undefined) {
        let sql = 'UPDATE users SET ';
        const updates = [];
        const params = [];

        if (full_name) {
          updates.push('full_name = ?');
          params.push(full_name);
        }
        if (phone !== undefined) {
          updates.push('phone = ?');
          params.push(phone);
        }
        if (is_active !== undefined) {
          updates.push('is_active = ?');
          params.push(is_active);
        }

        sql += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        await conn.execute(sql, params);
      }

      // Cập nhật staff role info
      if (position || salary) {
        let sql = 'UPDATE staff_roles SET ';
        const updates = [];
        const params = [];

        if (position) {
          updates.push('position = ?');
          params.push(position);
        }
        if (salary !== undefined) {
          updates.push('salary = ?');
          params.push(salary);
        }

        sql += updates.join(', ') + ' WHERE user_id = ?';
        params.push(id);

        await conn.execute(sql, params);
      }

      return { success: true };
    });

    return successResponse(res, result, 'Cập nhật nhân viên thành công');
  } catch (error) {
    next(error);
  }
};

// XÓA NHÂN VIÊN (soft delete)
export const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('UPDATE users SET is_active = FALSE WHERE id = ?', [id]);

    return successResponse(res, { id }, 'Xóa nhân viên thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY CHI TIẾT NHÂN VIÊN
export const getStaffDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT u.id, u.email, u.full_name, u.phone, r.name as role, u.is_active, u.created_at,
             s.name as store_name, sr.position, sr.hire_date, sr.salary
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN staff_roles sr ON u.id = sr.user_id
      LEFT JOIN stores s ON sr.store_id = s.id
      WHERE u.id = ? AND u.role_id IN (2, 3)
    `;

    const [data] = await query(sql, [id]);

    if (!data) {
      return errorResponse(res, 'Nhân viên không tồn tại', 404);
    }

    return successResponse(res, data, 'Lấy chi tiết nhân viên thành công');
  } catch (error) {
    next(error);
  }
};
