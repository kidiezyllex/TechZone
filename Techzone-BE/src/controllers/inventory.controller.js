import { query, transaction } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

// LẤY DANH SÁCH INVENTORY THEO STORE
export const getInventoryByStore = async (req, res, next) => {
  try {
    const { store_id, page = 1, limit = 20, search } = req.query;
    
    if (!store_id) {
      return errorResponse(res, 'Chi nhánh không được để trống', 400);
    }

    const offset = (page - 1) * limit;
    let sql = `
      SELECT i.id, i.product_id, i.store_id, i.quantity, i.reorder_level, i.last_restocked,
             p.name, p.sku, p.price, c.name as category_name, s.name as store_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN stores s ON i.store_id = s.id
      WHERE i.store_id = ? AND p.is_active = TRUE
    `;
    const params = [store_id];

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    const countSql = sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    sql += ' ORDER BY p.name LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [data] = await query(sql, params);

    return paginatedResponse(res, data, page, limit, total, 'Lấy danh sách kho thành công');
  } catch (error) {
    next(error);
  }
};

// NHẬP KHO
export const importInventory = async (req, res, next) => {
  try {
    const { store_id, product_id, quantity, supplier_id, notes } = req.body;

    if (!store_id || !product_id || !quantity) {
      return errorResponse(res, 'Thông tin không đầy đủ', 400);
    }

    const result = await transaction(async (conn) => {
      // Kiểm tra sản phẩm
      const [product] = await conn.execute('SELECT id FROM products WHERE id = ? AND is_active = TRUE', [product_id]);
      if (!product) {
        throw new ValidationError('Sản phẩm không tồn tại');
      }

      // Kiểm tra store
      const [store] = await conn.execute('SELECT id FROM stores WHERE id = ? AND is_active = TRUE', [store_id]);
      if (!store) {
        throw new ValidationError('Chi nhánh không tồn tại');
      }

      // Cập nhật inventory
      const [inventory] = await conn.execute(
        'SELECT id FROM inventory WHERE product_id = ? AND store_id = ? LIMIT 1',
        [product_id, store_id]
      );

      if (inventory) {
        await conn.execute(
          'UPDATE inventory SET quantity = quantity + ?, last_restocked = NOW() WHERE id = ?',
          [quantity, inventory.id]
        );
      } else {
        await conn.execute(
          'INSERT INTO inventory (product_id, store_id, quantity, reorder_level, last_restocked) VALUES (?, ?, ?, ?, NOW())',
          [product_id, store_id, quantity, 10]
        );
      }

      // Log nhập kho
      await conn.execute(
        'INSERT INTO inventory_logs (product_id, store_id, type, quantity, supplier_id, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [product_id, store_id, 'import', quantity, supplier_id || null, notes || null]
      );

      return { success: true, product_id, store_id, quantity };
    });

    return successResponse(res, result, 'Nhập kho thành công', 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

// XUẤT KHO
export const exportInventory = async (req, res, next) => {
  try {
    const { store_id, product_id, quantity, reason, notes } = req.body;

    if (!store_id || !product_id || !quantity || !reason) {
      return errorResponse(res, 'Thông tin không đầy đủ', 400);
    }

    const result = await transaction(async (conn) => {
      // Kiểm tra tồn kho
      const [inventory] = await conn.execute(
        'SELECT id, quantity FROM inventory WHERE product_id = ? AND store_id = ? LIMIT 1',
        [product_id, store_id]
      );

      if (!inventory || inventory.quantity < quantity) {
        throw new ValidationError('Tồn kho không đủ');
      }

      // Cập nhật inventory
      await conn.execute(
        'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
        [quantity, inventory.id]
      );

      // Log xuất kho
      await conn.execute(
        'INSERT INTO inventory_logs (product_id, store_id, type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
        [product_id, store_id, reason, quantity, notes || null]
      );

      return { success: true, product_id, store_id, quantity };
    });

    return successResponse(res, result, 'Xuất kho thành công', 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

// LẤY DANH SÁCH INVENTORY LOGS
export const getInventoryLogs = async (req, res, next) => {
  try {
    const { store_id, product_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT il.*, p.name as product_name, s.name as store_name
      FROM inventory_logs il
      JOIN products p ON il.product_id = p.id
      JOIN stores s ON il.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (store_id) {
      sql += ' AND il.store_id = ?';
      params.push(store_id);
    }
    if (product_id) {
      sql += ' AND il.product_id = ?';
      params.push(product_id);
    }

    const countSql = sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    sql += ' ORDER BY il.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [data] = await query(sql, params);

    return paginatedResponse(res, data, page, limit, total, 'Lấy danh sách nhật ký kho thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY DANH SÁCH SẢN PHẨM CẤN NHẬP KHO (stock < reorder_level)
export const getLowStockProducts = async (req, res, next) => {
  try {
    const { store_id } = req.query;

    if (!store_id) {
      return errorResponse(res, 'Chi nhánh không được để trống', 400);
    }

    const sql = `
      SELECT i.id, i.product_id, i.quantity, i.reorder_level,
             p.name, p.sku, p.price, c.name as category_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE i.store_id = ? AND i.quantity < i.reorder_level AND p.is_active = TRUE
      ORDER BY i.quantity ASC
    `;

    const [data] = await query(sql, [store_id]);

    return successResponse(res, data, 'Danh sách sản phẩm cần nhập kho');
  } catch (error) {
    next(error);
  }
};
