import { query, transaction } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { hashPassword } from '../utils/bcrypt.js';

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      orderId,
      customerId,
      items,
      subTotal,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 'Danh sách sản phẩm không được để trống', 400);
    }
    
    if (subTotal == null || total == null) {
      return errorResponse(res, 'Tổng tiền và tổng thanh toán không được để trống', 400);
    }
    
    if (!shippingAddress) {
      return errorResponse(res, 'Địa chỉ giao hàng không được để trống', 400);
    }
    
    if (!paymentMethod) {
      return errorResponse(res, 'Phương thức thanh toán không được để trống', 400);
    }
    
    let user_id_to_use = userId;
    let customerId_db;
    
    if (customerId) {
      const firebaseEmail = `${customerId}@firebase.user`;
      
      let [existingUser] = await query('SELECT id FROM users WHERE email = ?', [firebaseEmail]);
      
      if (!existingUser) {
        // Create new user from customerId and name
        const customerName = shippingAddress?.name || 'Khách hàng';
        const customerPhone = shippingAddress?.phoneNumber || null;
        
        // Get customer role
        const [customerRole] = await query(
          'SELECT id FROM roles WHERE name = ?',
          ['customer']
        );
        
        if (!customerRole) {
          return errorResponse(res, 'Không tìm thấy role customer', 500);
        }
        
        // Generate a random password hash (since it's Firebase auth, password is not used)
        const randomPassword = `firebase_${customerId}_${Date.now()}`;
        const hashedPassword = await hashPassword(randomPassword);
        
        // Create user
        const userResult = await query(
          `INSERT INTO users (email, password_hash, full_name, phone, role_id, is_verified) 
           VALUES (?, ?, ?, ?, ?, TRUE)`,
          [firebaseEmail, hashedPassword, customerName, customerPhone, customerRole.id]
        );
        
        user_id_to_use = userResult.insertId;
        
        // Create customer record
        await query(
          'INSERT INTO customers (user_id, classification) VALUES (?, ?)',
          [user_id_to_use, 'new']
        );
      } else {
        user_id_to_use = existingUser.id;
        
        // Update user info if provided (name and phone from shippingAddress)
        if (shippingAddress?.name || shippingAddress?.phoneNumber) {
          const updateFields = [];
          const updateValues = [];
          
          if (shippingAddress.name) {
            updateFields.push('full_name = ?');
            updateValues.push(shippingAddress.name);
          }
          
          if (shippingAddress.phoneNumber) {
            updateFields.push('phone = ?');
            updateValues.push(shippingAddress.phoneNumber);
          }
          
          if (updateFields.length > 0) {
            updateValues.push(user_id_to_use);
            await query(
              `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
              updateValues
            );
          }
        }
      }
    }
    
    const [customerCheck] = await query('SELECT id FROM customers WHERE user_id = ?', [user_id_to_use]);
    if (!customerCheck) {
      await query(
        'INSERT INTO customers (user_id, classification) VALUES (?, ?)',
        [user_id_to_use, 'new']
      );
      const [newCustomer] = await query('SELECT id FROM customers WHERE user_id = ?', [user_id_to_use]);
      customerId_db = newCustomer.id;
    } else {
      customerId_db = customerCheck.id;
    }
    
    const orderNumber = orderId || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const deliveryAddress = shippingAddress.specificAddress != null ? String(shippingAddress.specificAddress) : null;
    const deliveryCity = shippingAddress.provinceId ? null : (shippingAddress.city != null ? String(shippingAddress.city) : null);
    const deliveryPhone = shippingAddress.phoneNumber != null ? String(shippingAddress.phoneNumber) : null;
    
    const paymentMethodNormalized = paymentMethod.toLowerCase() === 'cod' ? 'cod' : 'online';
    
    const subtotalValue = parseFloat(subTotal);
    const discountAmount = discount != null ? parseFloat(discount) : 0;
    const totalAmount = parseFloat(total);
    const notesValue = notes != null ? notes : null;
    const storeIdValue = shippingAddress.storeId != null ? parseInt(shippingAddress.storeId) : null;
    
    const deliveryType = deliveryAddress ? 'delivery' : 'pickup';
    
    const result = await transaction(async (conn) => {
      // Validate and process items
      const orderItems = [];
      for (const item of items) {
        if (!item.product || !item.quantity || item.price == null) {
          throw new ValidationError('Thông tin sản phẩm không hợp lệ');
        }
        
        const productId = parseInt(item.product);
        const quantity = parseInt(item.quantity);
        const unitPrice = parseFloat(item.price);
        
        // Get product details
        const [productRows] = await conn.execute(
          'SELECT id, name FROM products WHERE id = ? AND is_active = TRUE',
          [productId]
        );
        
        if (productRows.length === 0) {
          throw new ValidationError(`Sản phẩm với ID ${productId} không tồn tại hoặc không còn hoạt động`);
        }
        
        const product = productRows[0];
        
        // Check inventory if store_id is provided
        if (storeIdValue) {
          const [inventoryRows] = await conn.execute(
            'SELECT id, quantity FROM inventory WHERE product_id = ? AND store_id = ? LIMIT 1',
            [productId, storeIdValue]
          );
          
          if (inventoryRows.length > 0) {
            const inventory = inventoryRows[0];
            if (inventory.quantity < quantity) {
              throw new ValidationError(`Sản phẩm "${product.name}" không đủ hàng tại chi nhánh này`);
            }
            
            // Update inventory
            await conn.execute(
              'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
              [quantity, inventory.id]
            );
          }
        }
        
        orderItems.push({
          productId,
          productName: product.name,
          quantity,
          unitPrice,
          subtotal: unitPrice * quantity
        });
      }
      
      const shippingFee = 0;
      
      const [orderResult] = await conn.execute(
        `INSERT INTO orders (
          order_number, customer_id, store_id, delivery_type, 
          delivery_address, delivery_city, delivery_phone, 
          payment_method, subtotal, discount_amount, shipping_fee, total_amount, 
          status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [
          orderNumber,
          customerId_db,
          storeIdValue,
          deliveryType,
          deliveryAddress,
          deliveryCity,
          deliveryPhone,
          paymentMethodNormalized,
          subtotalValue,
          discountAmount,
          shippingFee,
          totalAmount,
          notesValue
        ]
      );
      
      const orderId_db = orderResult.insertId;
      
      // Create order items
      for (const item of orderItems) {
        await conn.execute(
          `INSERT INTO order_items (
            order_id, product_id, product_name, quantity, unit_price, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId_db,
            item.productId,
            item.productName,
            item.quantity,
            item.unitPrice,
            item.subtotal
          ]
        );
        
        // Update sold_count
        await conn.execute(
          'UPDATE products SET sold_count = sold_count + ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }
      
      // Update customer stats
      await conn.execute(
        `UPDATE customers SET 
          total_orders = total_orders + 1, 
          total_spent = total_spent + ?, 
          last_order_date = NOW()
         WHERE id = ?`,
        [totalAmount, customerId_db]
      );
      
      return orderId_db;
    });
    
    const [order] = await query('SELECT * FROM orders WHERE id = ?', [result]);
    
    return successResponse(res, order, 'Đặt hàng thành công', 201);
  } catch (error) {
    // Handle custom validation errors
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    // Get customer_id from user_id
    const [customer] = await query('SELECT id FROM customers WHERE user_id = ?', [userId]);
    if (!customer) {
      return errorResponse(res, 'Không tìm thấy thông tin khách hàng', 404);
    }
    
    let sql = 'SELECT * FROM orders WHERE customer_id = ?';
    const params = [customer.id];
    
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
    const userRole = req.user.role_name?.toLowerCase();
    const { id } = req.params;
    
    const isAdminOrStaff = userRole === 'admin' || userRole === 'staff';
    
    let order;
    let sql = `SELECT o.*, s.name as store_name, s.address as store_address
               FROM orders o
               LEFT JOIN stores s ON o.store_id = s.id
               WHERE o.id = ?`;
    let params = [id];
    
    if (!isAdminOrStaff) {
      let [customer] = await query('SELECT id FROM customers WHERE user_id = ?', [userId]);
      
      if (!customer) {
        try {
          await query(
            'INSERT INTO customers (user_id, classification) VALUES (?, ?)',
            [userId, 'new']
          );
          [customer] = await query('SELECT id FROM customers WHERE user_id = ?', [userId]);
        } catch (error) {
          [customer] = await query('SELECT id FROM customers WHERE user_id = ?', [userId]);
        }
        
        if (!customer) {
          return errorResponse(res, 'Không tìm thấy thông tin khách hàng', 404);
        }
      }
      
      sql += ' AND o.customer_id = ?';
      params.push(customer.id);
    }
    
    const [orderResult] = await query(sql, params);
    order = orderResult;
    
    if (!order) {
      return errorResponse(res, 'Không tìm thấy đơn hàng', 404);
    }
    
    const items = await query(
      `SELECT oi.*, p.name as product_name, 
              (SELECT image_url FROM product_images 
               WHERE product_id = p.id 
               ORDER BY is_primary DESC, display_order ASC 
               LIMIT 1) as image_url
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

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    
    // Validate that at least one field is provided
    if (!status && !paymentStatus) {
      return errorResponse(res, 'Cần cung cấp ít nhất một trường: status hoặc paymentStatus', 400);
    }
    
    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'packing', 'shipping', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return errorResponse(res, 'Trạng thái không hợp lệ', 400);
      }
    }
    
    // Validate paymentStatus if provided
    if (paymentStatus) {
      const validPaymentStatuses = ['pending', 'paid', 'refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return errorResponse(res, 'Trạng thái thanh toán không hợp lệ', 400);
      }
    }
    
    const [order] = await query('SELECT id, status, payment_status FROM orders WHERE id = ?', [id]);
    if (!order) {
      return errorResponse(res, 'Không tìm thấy đơn hàng', 404);
    }
    
    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
      
      // Update timestamps based on status
      if (status === 'confirmed') {
        updateFields.push('confirmed_at = NOW()');
      } else if (status === 'completed') {
        updateFields.push('completed_at = NOW()');
      }
    }
    
    if (paymentStatus) {
      updateFields.push('payment_status = ?');
      updateValues.push(paymentStatus);
    }
    
    updateFields.push('updated_at = NOW()');
    updateValues.push(id);
    
    await query(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    const [updated] = await query('SELECT * FROM orders WHERE id = ?', [id]);
    
    return successResponse(res, updated, 'Cập nhật trạng thái đơn hàng thành công');
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get customer_id from user_id
    const [customer] = await query('SELECT id FROM customers WHERE user_id = ?', [userId]);
    if (!customer) {
      return errorResponse(res, 'Không tìm thấy thông tin khách hàng', 404);
    }
    
    const [order] = await query(
      'SELECT id, status FROM orders WHERE id = ? AND customer_id = ?',
      [id, customer.id]
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

export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, store_id, search } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT o.*, u.email, u.full_name as customer_name, s.name as store_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON c.user_id = u.id
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
