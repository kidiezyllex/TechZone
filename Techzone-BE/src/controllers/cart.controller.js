import { query, transaction } from '../config/database.config.js';
import { successResponse, errorResponse } from '../utils/response.js';

// LẤY GIỎ HÀNG CỦA USER
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Lấy cart
    const [cart] = await query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    
    if (!cart) {
      const result = await query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cart = { id: result.insertId, user_id: userId };
    }
    
    // Lấy cart items
    const items = await query(
      `SELECT ci.*, p.name, p.price, p.discount_percentage, p.image_url,
              (p.price * (100 - p.discount_percentage) / 100) as final_price,
              (ci.quantity * p.price * (100 - p.discount_percentage) / 100) as subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ? AND p.is_active = TRUE`,
      [cart.id]
    );
    
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    return successResponse(res, { cart, items, total }, 'Lấy giỏ hàng thành công');
  } catch (error) {
    next(error);
  }
};

// THÊM SẢN PHẨM VÀO GIỎ HÀNG
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;
    
    // Kiểm tra sản phẩm tồn tại
    const [product] = await query(
      'SELECT id, name, price FROM products WHERE id = ? AND is_active = TRUE',
      [product_id]
    );
    
    if (!product) {
      return errorResponse(res, 'Sản phẩm không tồn tại', 404);
    }
    
    // Kiểm tra tồn kho
    const [{ total_stock }] = await query(
      'SELECT SUM(quantity) as total_stock FROM inventory WHERE product_id = ?',
      [product_id]
    );
    
    if (!total_stock || total_stock < quantity) {
      return errorResponse(res, 'Sản phẩm hết hàng hoặc không đủ số lượng', 400);
    }
    
    // Lấy hoặc tạo cart
    let [cart] = await query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (!cart) {
      const result = await query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cart = { id: result.insertId };
    }
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const [existingItem] = await query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cart.id, product_id]
    );
    
    if (existingItem) {
      // Cập nhật số lượng
      const newQuantity = existingItem.quantity + quantity;
      await query(
        'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?',
        [newQuantity, existingItem.id]
      );
    } else {
      // Thêm mới
      await query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cart.id, product_id, quantity]
      );
    }
    
    return successResponse(res, null, 'Thêm vào giỏ hàng thành công', 201);
  } catch (error) {
    next(error);
  }
};

// CẬP NHẬT SỐ LƯỢNG TRONG GIỎ
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { item_id } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return errorResponse(res, 'Số lượng phải lớn hơn 0', 400);
    }
    
    // Kiểm tra cart item thuộc user
    const [item] = await query(
      `SELECT ci.*, c.user_id 
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = ? AND c.user_id = ?`,
      [item_id, userId]
    );
    
    if (!item) {
      return errorResponse(res, 'Không tìm thấy sản phẩm trong giỏ hàng', 404);
    }
    
    // Kiểm tra tồn kho
    const [{ total_stock }] = await query(
      'SELECT SUM(quantity) as total_stock FROM inventory WHERE product_id = ?',
      [item.product_id]
    );
    
    if (total_stock < quantity) {
      return errorResponse(res, 'Không đủ hàng trong kho', 400);
    }
    
    await query('UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?', [quantity, item_id]);
    
    return successResponse(res, null, 'Cập nhật số lượng thành công');
  } catch (error) {
    next(error);
  }
};

// XÓA SẢN PHẨM KHỎI GIỎ HÀNG
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { item_id } = req.params;
    
    const [item] = await query(
      `SELECT ci.id FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = ? AND c.user_id = ?`,
      [item_id, userId]
    );
    
    if (!item) {
      return errorResponse(res, 'Không tìm thấy sản phẩm trong giỏ hàng', 404);
    }
    
    await query('DELETE FROM cart_items WHERE id = ?', [item_id]);
    
    return successResponse(res, null, 'Xóa sản phẩm khỏi giỏ hàng thành công');
  } catch (error) {
    next(error);
  }
};

// XÓA TOÀN BỘ GIỎ HÀNG
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const [cart] = await query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    
    if (cart) {
      await query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    }
    
    return successResponse(res, null, 'Xóa giỏ hàng thành công');
  } catch (error) {
    next(error);
  }
};
