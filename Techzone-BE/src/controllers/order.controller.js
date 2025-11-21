import { query, transaction } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

// TẠO ĐƠN HÀNG (Checkout)
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { store_id, shipping_address, shipping_city, shipping_district, phone, payment_method, notes } = req.body;
    
    const result = await transaction(async (conn) => {
      // Lấy cart items
      const [cart] = await conn.execute('SELECT id FROM carts WHERE user_id = ?', [userId]);
      
      if (!cart) {
        throw new Error('Giỏ hàng trống');
      }
      
      const [items] = await conn.execute(
        `SELECT ci.product_id, ci.quantity, p.name, p.price, p.discount_percentage,
                (p.price * (100 - p.discount_percentage) / 100) as unit_price
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = ? AND p.is_active = TRUE`,
        [cart.id]
      );
      
      if (items.length === 0) {
        throw new Error('Giỏ hàng trống');
      }
      
      // Tính tổng tiền
      let totalAmount = 0;
      for (const item of items) {
        totalAmount += item.unit_price * item.quantity;
        
        // Kiểm tra và trừ tồn kho
        const [inventory] = await conn.execute(
          'SELECT id, quantity FROM inventory WHERE product_id = ? AND store_id = ? LIMIT 1',
          [item.product_id, store_id]
        );
        
        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Sản phẩm "${item.name}" không đủ hàng tại chi nhánh này`);
        }
        
        await conn.execute(
          'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
          [item.quantity, inventory.id]
        );
      }
      
      // Tạo đơn hàng
      const [orderResult] = await conn.execute(
        `INSERT INTO orders (user_id, store_id, total_amount, shipping_address, shipping_city, shipping_district, phone, payment_method, notes, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [userId, store_id, totalAmount, shipping_address, shipping_city, shipping_district, phone, payment_method, notes || null]
      );
      
      const orderId = orderResult.insertId;
      
      // Tạo order items
      for (const item of items) {
        await conn.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.unit_price, item.unit_price * item.quantity]
        );
        
        // Cập nhật sold_count
        await conn.execute(
          'UPDATE products SET sold_count = sold_count + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      // Xóa cart items
      await conn.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
      
      // Cập nhật customer stats
      await conn.execute(
        `UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ?, last_order_date = NOW()
         WHERE user_id = ?`,
        [totalAmount, userId]
      );
      
      return orderId;
    });
    
    const [order] = await query('SELECT * FROM orders WHERE id = ?', [result]);
    
    return successResponse(res, order, 'Đặt hàng thành công', 201);
  } catch (error) {
    next(error);
  }
};

// LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [{ total }] = await query(countSql, params);
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const orders = await query(sql, params);
    
    return paginatedResponse(res, orders, page, limit, total, 'Lấy danh sách đơn hàng thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY CHI TIẾT ĐƠN HÀNG
export const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const [order] = await query(
      `SELECT o.*, s.name as store_name, s.address as store_address
       FROM orders o
       LEFT JOIN stores s ON o.store_id = s.id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, userId]
    );
    
    if (!order) {
      return errorResponse(res, 'Không tìm thấy đơn hàng', 404);
    }
    
    const items = await query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );
    
    order.items = items;
    
    return successResponse(res, order, 'Lấy chi tiết đơn hàng thành công');
  } catch (error) {
    next(error);
  }
};

// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Staff/Admin only)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Trạng thái không hợp lệ', 400);
    }
    
    const [order] = await query('SELECT id, status FROM orders WHERE id = ?', [id]);
    if (!order) {
      return errorResponse(res, 'Không tìm thấy đơn hàng', 404);
    }
    
    await query('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    
    const [updated] = await query('SELECT * FROM orders WHERE id = ?', [id]);
    
    return successResponse(res, updated, 'Cập nhật trạng thái đơn hàng thành công');
  } catch (error) {
    next(error);
  }
};

// HỦY ĐƠN HÀNG (Customer)
export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const [order] = await query(
      'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (!order) {
      return errorResponse(res, 'Không tìm thấy đơn hàng', 404);
    }
    
    if (!['pending', 'confirmed'].includes(order.status)) {
      return errorResponse(res, 'Không thể hủy đơn hàng ở trạng thái này', 400);
    }
    
    await query('UPDATE orders SET status = "cancelled", updated_at = NOW() WHERE id = ?', [id]);
    
    return successResponse(res, null, 'Hủy đơn hàng thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY TẤT CẢ ĐƠN HÀNG (Admin/Staff)
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, store_id, search } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT o.*, u.email, u.full_name as customer_name, s.name as store_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN stores s ON o.store_id = s.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    if (store_id) {
      sql += ' AND o.store_id = ?';
      params.push(store_id);
    }
    if (search) {
      sql += ' AND (o.id LIKE ? OR u.email LIKE ? OR u.full_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countSql = sql.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as total FROM');
    const [{ total }] = await query(countSql, params);
    
    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const orders = await query(sql, params);
    
    return paginatedResponse(res, orders, page, limit, total, 'Lấy danh sách đơn hàng thành công');
  } catch (error) {
    next(error);
  }
};
