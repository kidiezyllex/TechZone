import { query } from '../config/database.config.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

// LẤY DANH SÁCH SẢN PHẨM (có phân trang, filter, search)
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category_id,
      brand_id,
      min_price,
      max_price,
      search,
      sort_by = 'created_at',
      order = 'DESC',
      is_featured,
      in_stock
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name,
             (SELECT SUM(quantity) FROM inventory WHERE product_id = p.id) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = TRUE
    `;
    
    const params = [];
    
    if (category_id) {
      sql += ' AND p.category_id = ?';
      params.push(category_id);
    }
    if (brand_id) {
      sql += ' AND p.brand_id = ?';
      params.push(brand_id);
    }
    if (min_price) {
      sql += ' AND p.price >= ?';
      params.push(min_price);
    }
    if (max_price) {
      sql += ' AND p.price <= ?';
      params.push(max_price);
    }
    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (is_featured === 'true') {
      sql += ' AND p.is_featured = TRUE';
    }
    if (in_stock === 'true') {
      sql += ' AND (SELECT SUM(quantity) FROM inventory WHERE product_id = p.id) > 0';
    }
    
    // Count total
    const countSql = sql.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as total FROM');
    const [{ total }] = await query(countSql, params);
    
    // Add sorting và pagination
    const validSortBy = ['name', 'price', 'created_at', 'sold_count'];
    const sortField = validSortBy.includes(sort_by) ? sort_by : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    sql += ` ORDER BY p.${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    
    const products = await query(sql, params);
    
    return paginatedResponse(res, products, page, limit, total, 'Lấy danh sách sản phẩm thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY CHI TIẾT SẢN PHẨM
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [product] = await query(
      `SELECT p.*, c.name as category_name, b.name as brand_name,
              (SELECT SUM(quantity) FROM inventory WHERE product_id = p.id) as total_stock,
              (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as avg_rating,
              (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.id = ? AND p.is_active = TRUE`,
      [id]
    );
    
    if (!product) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', 404);
    }
    
    // Lấy hình ảnh sản phẩm
    const images = await query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [id]
    );
    product.images = images;
    
    // Lấy tồn kho theo chi nhánh
    const inventory = await query(
      `SELECT i.*, s.name as store_name 
       FROM inventory i
       JOIN stores s ON i.store_id = s.id
       WHERE i.product_id = ?`,
      [id]
    );
    product.inventory = inventory;
    
    return successResponse(res, product, 'Lấy chi tiết sản phẩm thành công');
  } catch (error) {
    next(error);
  }
};

// TẠO SẢN PHẨM MỚI (Admin/Staff only)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, sku, category_id, brand_id, price, cost_price, discount_percentage, warranty_period,
      specifications, images
    } = req.body;
    
    // Kiểm tra SKU trùng
    const [existing] = await query('SELECT id FROM products WHERE sku = ?', [sku]);
    if (existing) {
      return errorResponse(res, 'Mã SKU đã tồn tại', 409);
    }
    
    // Tạo product
    const result = await query(
      `INSERT INTO products (name, description, sku, category_id, brand_id, price, cost_price, discount_percentage, warranty_period)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, sku, category_id, brand_id, price, cost_price || null, discount_percentage || 0, warranty_period || 12]
    );
    
    const productId = result.insertId;
    
    // Thêm specifications nếu có
    if (specifications && specifications.length > 0) {
      for (const spec of specifications) {
        await query(
          'INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES (?, ?, ?)',
          [productId, spec.spec_name, spec.spec_value]
        );
      }
    }
    
    // Thêm hình ảnh nếu có
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await query(
          'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
          [productId, images[i].image_url, i]
        );
      }
    }
    
    const [newProduct] = await query('SELECT * FROM products WHERE id = ?', [productId]);
    
    return successResponse(res, newProduct, 'Tạo sản phẩm thành công', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name, description, category_id, brand_id, 
      base_price, selling_price, discount_price,
      specifications, images,
      is_featured, is_new, is_active
    } = req.body;
    
    const [product] = await query('SELECT id FROM products WHERE id = ?', [id]);
    if (!product) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', 404);
    }
    
    const updates = [];
    const values = [];
    
    if (name) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (category_id) { updates.push('category_id = ?'); values.push(category_id); }
    if (brand_id) { updates.push('brand_id = ?'); values.push(brand_id); }
    if (base_price !== undefined) { updates.push('base_price = ?'); values.push(base_price); }
    if (selling_price !== undefined) { updates.push('selling_price = ?'); values.push(selling_price); }
    if (discount_price !== undefined) { updates.push('discount_price = ?'); values.push(discount_price); }
    if (specifications !== undefined) {
      const specValue = typeof specifications === 'string' ? specifications : JSON.stringify(specifications);
      updates.push('specifications = ?');
      values.push(specValue);
    }
    if (is_featured !== undefined) { updates.push('is_featured = ?'); values.push(is_featured); }
    if (is_new !== undefined) { updates.push('is_new = ?'); values.push(is_new); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
    
    // Cập nhật thông tin sản phẩm nếu có
    if (updates.length > 0) {
      values.push(id);
      await query(`UPDATE products SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
    }
    
    // Cập nhật hình ảnh nếu có
    if (images !== undefined && Array.isArray(images)) {
      // Xóa tất cả hình ảnh cũ
      await query('DELETE FROM product_images WHERE product_id = ?', [id]);
      
      // Thêm hình ảnh mới
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          // Hỗ trợ cả mảng string và mảng object
          const imageUrl = typeof images[i] === 'string' ? images[i] : images[i].image_url || images[i].url;
          const isPrimary = i === 0; // Ảnh đầu tiên là primary
          
          await query(
            'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
            [id, imageUrl, isPrimary, i]
          );
        }
      }
    }
    
    // Lấy thông tin sản phẩm đã cập nhật
    const [updated] = await query('SELECT * FROM products WHERE id = ?', [id]);
    
    // Lấy hình ảnh sản phẩm
    const productImages = await query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [id]
    );
    updated.images = productImages;
    
    return successResponse(res, updated, 'Cập nhật sản phẩm thành công');
  } catch (error) {
    next(error);
  }
};

// XÓA SẢN PHẨM (soft delete)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [product] = await query('SELECT id FROM products WHERE id = ?', [id]);
    if (!product) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', 404);
    }
    
    await query('UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE id = ?', [id]);
    
    return successResponse(res, null, 'Xóa sản phẩm thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY SẢN PHẨM BÁN CHẠY
export const getBestSellers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await query(
      `SELECT p.*, c.name as category_name, b.name as brand_name, p.sold_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.is_active = TRUE AND p.sold_count > 0
       ORDER BY p.sold_count DESC
       LIMIT ?`,
      [parseInt(limit)]
    );
    
    return successResponse(res, products, 'Lấy sản phẩm bán chạy thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY SẢN PHẨM MỚI NHẤT
export const getNewProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await query(
      `SELECT p.*, c.name as category_name, b.name as brand_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.is_active = TRUE
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [parseInt(limit)]
    );
    
    return successResponse(res, products, 'Lấy sản phẩm mới nhất thành công');
  } catch (error) {
    next(error);
  }
};
