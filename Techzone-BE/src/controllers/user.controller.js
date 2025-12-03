import { query, transaction } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { hashPassword } from '../utils/bcrypt.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors.js';

// LẤY DANH SÁCH USERS (Staff và Customer)
export const getUsers = async (req, res, next) => {
  try {
    const { 
      role_id, 
      store_id, 
      page = 1, 
      limit = 20, 
      search,
      sort_by = 'created_at',
      order = 'DESC'
    } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT u.id, u.email, u.full_name, u.phone, u.is_active, u.created_at, u.store_id,
             r.name as role_name, r.id as role_id,
             s.name as store_name,
             c.classification, c.total_orders, c.total_spent, c.last_order_date
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN stores s ON u.store_id = s.id
      LEFT JOIN customers c ON u.id = c.user_id
      WHERE 1=1
    `;
    const params = [];

    // Filter by role
    if (role_id) {
      sql += ' AND u.role_id = ?';
      params.push(role_id);
    } else {
      // Default: show all roles except admin (role_id 1)
      sql += ' AND u.role_id != 1';
    }

    // Filter by store (for staff)
    if (store_id) {
      sql += ' AND u.store_id = ?';
      params.push(store_id);
    }

    // Search
    if (search) {
      sql += ' AND (u.email LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    // Count total
    const countSql = sql.replace(/SELECT.*FROM/, 'SELECT COUNT(DISTINCT u.id) as total FROM');
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    // Sorting
    const validSort = ['created_at', 'full_name', 'email', 'total_spent', 'total_orders'];
    const sortField = validSort.includes(sort_by) ? sort_by : 'created_at';
    const sortTable = ['total_spent', 'total_orders'].includes(sortField) ? 'c' : 'u';
    
    sql += ` ORDER BY ${sortTable}.${sortField} ${order === 'ASC' ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const data = await query(sql, params);

    return paginatedResponse(res, data, page, limit, total, 'Lấy danh sách users thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY CHI TIẾT USER
export const getUserDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT u.*, r.name as role_name,
             s.name as store_name,
             c.id as customer_id, c.classification, c.total_orders, c.total_spent, c.last_order_date, c.notes as customer_notes
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN stores s ON u.store_id = s.id
      LEFT JOIN customers c ON u.id = c.user_id
      WHERE u.id = ?
    `;

    const [user] = await query(sql, [id]);

    if (!user) {
      return errorResponse(res, 'User không tồn tại', 404);
    }

    // Get additional info based on role
    if (user.role_id === 3) {
      // Customer: get order history
      const orders = await query(
        `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, o.created_at
         FROM orders o
         WHERE o.customer_id = ?
         ORDER BY o.created_at DESC
         LIMIT 10`,
        [user.customer_id]
      );
      user.recent_orders = orders;
    } else if (user.role_id === 2) {
      // Staff: store info is already joined above
      if (user.store_id) {
        const [storeInfo] = await query('SELECT * FROM stores WHERE id = ?', [user.store_id]);
        user.store_info = storeInfo;
      }
    }

    // Remove sensitive data
    delete user.password_hash;

    return successResponse(res, user, 'Lấy chi tiết user thành công');
  } catch (error) {
    next(error);
  }
};

// TẠO USER (Staff hoặc Customer)
export const createUser = async (req, res, next) => {
  try {
    const { 
      email, 
      full_name, 
      phone, 
      role_id, 
      store_id,
      password 
    } = req.body;

    if (!email || !full_name || !role_id) {
      return errorResponse(res, 'Email, tên và role_id là bắt buộc', 400);
    }

    // Validate role_id (should be 2 for staff or 3 for customer)
    if (![2, 3].includes(parseInt(role_id))) {
      return errorResponse(res, 'role_id phải là 2 (Staff) hoặc 3 (Customer)', 400);
    }

    // Staff requires store_id
    if (parseInt(role_id) === 2 && !store_id) {
      return errorResponse(res, 'store_id là bắt buộc cho Staff', 400);
    }

    const result = await transaction(async (conn) => {
      // Check if email exists
      const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        throw new ConflictError('Email đã tồn tại');
      }

      // Generate password if not provided
      let hashedPassword;
      let tempPassword = null;
      
      if (password) {
        hashedPassword = await hashPassword(password);
      } else {
        tempPassword = Math.random().toString(36).slice(2, 10);
        hashedPassword = await hashPassword(tempPassword);
      }

      // Create user
      const [userResult] = await conn.execute(
        `INSERT INTO users (email, password_hash, full_name, phone, role_id, store_id, is_active, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
        [email, hashedPassword, full_name, phone || null, role_id, parseInt(role_id) === 2 ? store_id : null]
      );

      const userId = userResult.insertId;

      // Create role-specific records
      if (parseInt(role_id) === 3) {
        // Customer: create customer record
        await conn.execute(
          'INSERT INTO customers (user_id, classification) VALUES (?, ?)',
          [userId, 'new']
        );
      }

      return {
        id: userId,
        email,
        full_name,
        role_id: parseInt(role_id),
        temporary_password: tempPassword
      };
    });

    return successResponse(res, result, 'Tạo user thành công', 201);
  } catch (error) {
    if (error instanceof ConflictError) {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

// CẬP NHẬT USER
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      full_name, 
      phone, 
      is_active,
      // Staff specific
      store_id,
      // Customer specific
      classification,
      notes
    } = req.body;

    const result = await transaction(async (conn) => {
      // Get user info to determine role
      const [user] = await conn.execute('SELECT role_id FROM users WHERE id = ?', [id]);
      if (user.length === 0) {
        throw new NotFoundError('User không tồn tại');
      }

      const roleId = user[0].role_id;

      // Update user basic info (including store_id for staff)
      if (full_name || phone !== undefined || is_active !== undefined || store_id !== undefined) {
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
        if (store_id !== undefined && roleId === 2) {
          // Only update store_id for staff
          updates.push('store_id = ?');
          params.push(store_id);
        }

        sql += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        await conn.execute(sql, params);
      }

      // Update customer-specific info
      if (roleId === 3) {
        if (classification || notes !== undefined) {
          // Get customer_id
          const [customer] = await conn.execute(
            'SELECT id FROM customers WHERE user_id = ?',
            [id]
          );

          let sql = '';
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

          if (updates.length > 0) {
            if (customer.length > 0) {
              sql = `UPDATE customers SET ${updates.join(', ')} WHERE user_id = ?`;
              params.push(id);
              await conn.execute(sql, params);
            } else {
              // Create customer record if doesn't exist
              const columns = ['user_id'];
              const values = [id];
              
              if (classification) {
                columns.push('classification');
                values.push(classification);
              }
              if (notes !== undefined) {
                columns.push('notes');
                values.push(notes);
              }
              
              sql = `INSERT INTO customers (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
              await conn.execute(sql, values);
            }
          }
        }
      }

      return { success: true };
    });

    const [updated] = await query(
      `SELECT u.*, r.name as role_name,
              s.name as store_name,
              c.classification, c.total_orders, c.total_spent
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN stores s ON u.store_id = s.id
       LEFT JOIN customers c ON u.id = c.user_id
       WHERE u.id = ?`,
      [id]
    );

    // Remove sensitive data
    if (updated) {
      delete updated.password_hash;
    }

    return successResponse(res, updated, 'Cập nhật user thành công');
  } catch (error) {
    if (error instanceof NotFoundError) {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

// XÓA USER (soft delete)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('UPDATE users SET is_active = FALSE WHERE id = ?', [id]);

    return successResponse(res, { id }, 'Xóa user thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY DANH SÁCH KHÁCH HÀNG VIP
export const getVIPCustomers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const sql = `
      SELECT u.id, u.email, u.full_name, u.phone, u.created_at,
             c.classification, c.total_orders, c.total_spent, c.last_order_date
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.total_spent > 0
      ORDER BY c.total_spent DESC
      LIMIT ?
    `;

    const data = await query(sql, [limit]);

    return successResponse(res, data, 'Lấy danh sách khách hàng VIP thành công');
  } catch (error) {
    next(error);
  }
};

// PHÂN LOẠI KHÁCH HÀNG
export const classifyCustomers = async (req, res, next) => {
  try {
    // Update classification based on total_spent
    // Classification enum: 'new','regular','vip','inactive'
    await query(`
      UPDATE customers SET classification = CASE
        WHEN total_spent >= 50000000 THEN 'vip'
        WHEN total_spent >= 20000000 THEN 'regular'
        WHEN total_spent >= 5000000 THEN 'regular'
        ELSE 'new'
      END
    `);

    return successResponse(res, { success: true }, 'Phân loại khách hàng thành công');
  } catch (error) {
    next(error);
  }
};

