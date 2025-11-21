import { query } from '../config/database.config.js';
import { successResponse, errorResponse } from '../utils/response.js';

// LẤY TẤT CẢ DANH MỤC
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) as product_count
       FROM categories c
       WHERE c.is_active = TRUE
       ORDER BY c.display_order, c.name`
    );
    
    return successResponse(res, categories, 'Lấy danh sách danh mục thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY DANH MỤC THEO ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [category] = await query(
      `SELECT c.*,
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) as product_count
       FROM categories c
       WHERE c.id = ? AND c.is_active = TRUE`,
      [id]
    );
    
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', 404);
    }
    
    return successResponse(res, category, 'Lấy danh mục thành công');
  } catch (error) {
    next(error);
  }
};

// TẠO DANH MỤC MỚI
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, display_order } = req.body;
    
    const result = await query(
      'INSERT INTO categories (name, description, icon, display_order) VALUES (?, ?, ?, ?)',
      [name, description || null, icon || null, display_order || 0]
    );
    
    const [newCategory] = await query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    
    return successResponse(res, newCategory, 'Tạo danh mục thành công', 201);
  } catch (error) {
    next(error);
  }
};

// CẬP NHẬT DANH MỤC
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, display_order, is_active } = req.body;
    
    const [category] = await query('SELECT id FROM categories WHERE id = ?', [id]);
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', 404);
    }
    
    const updates = [];
    const values = [];
    
    if (name) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (icon !== undefined) { updates.push('icon = ?'); values.push(icon); }
    if (display_order !== undefined) { updates.push('display_order = ?'); values.push(display_order); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
    
    if (updates.length === 0) {
      return errorResponse(res, 'Không có thông tin cần cập nhật', 400);
    }
    
    values.push(id);
    await query(`UPDATE categories SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
    
    const [updated] = await query('SELECT * FROM categories WHERE id = ?', [id]);
    
    return successResponse(res, updated, 'Cập nhật danh mục thành công');
  } catch (error) {
    next(error);
  }
};

// XÓA DANH MỤC
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [category] = await query('SELECT id FROM categories WHERE id = ?', [id]);
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', 404);
    }
    
    // Kiểm tra có sản phẩm không
    const [{ count }] = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );
    
    if (count > 0) {
      return errorResponse(res, 'Không thể xóa danh mục có sản phẩm', 400);
    }
    
    await query('UPDATE categories SET is_active = FALSE WHERE id = ?', [id]);
    
    return successResponse(res, null, 'Xóa danh mục thành công');
  } catch (error) {
    next(error);
  }
};

// LẤY TẤT CẢ BRANDS
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await query(
      `SELECT b.*,
              (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id AND p.is_active = TRUE) as product_count
       FROM brands b
       WHERE b.is_active = TRUE
       ORDER BY b.name`
    );
    
    return successResponse(res, brands, 'Lấy danh sách thương hiệu thành công');
  } catch (error) {
    next(error);
  }
};

// TẠO BRAND MỚI
export const createBrand = async (req, res, next) => {
  try {
    const { name, description, logo_url } = req.body;
    
    const result = await query(
      'INSERT INTO brands (name, description, logo_url) VALUES (?, ?, ?)',
      [name, description || null, logo_url || null]
    );
    
    const [newBrand] = await query('SELECT * FROM brands WHERE id = ?', [result.insertId]);
    
    return successResponse(res, newBrand, 'Tạo thương hiệu thành công', 201);
  } catch (error) {
    next(error);
  }
};

// CẬP NHẬT BRAND
export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, logo_url, is_active } = req.body;
    
    const updates = [];
    const values = [];
    
    if (name) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (logo_url !== undefined) { updates.push('logo_url = ?'); values.push(logo_url); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
    
    if (updates.length === 0) {
      return errorResponse(res, 'Không có thông tin cần cập nhật', 400);
    }
    
    values.push(id);
    await query(`UPDATE brands SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
    
    const [updated] = await query('SELECT * FROM brands WHERE id = ?', [id]);
    
    return successResponse(res, updated, 'Cập nhật thương hiệu thành công');
  } catch (error) {
    next(error);
  }
};
