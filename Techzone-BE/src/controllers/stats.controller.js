import { query } from '../config/database.config.js';
import { successResponse, errorResponse } from '../utils/response.js';

// DASHBOARD - THỐNG KÊ TỔNG QUÁT
export const getDashboardStats = async (req, res, next) => {
  try {
    const { store_id, from_date, to_date } = req.query;

    let dateFilter = '';
    const params = [];

    if (from_date && to_date) {
      dateFilter = ' AND o.created_at BETWEEN ? AND ?';
      params.push(from_date, to_date);
    }

    // Tổng doanh thu
    const [revenueResult] = await query(
      `SELECT COALESCE(SUM(total_amount), 0) as total_revenue, 
              COUNT(*) as total_orders
       FROM orders o
       WHERE o.status IN ('completed', 'processing') ${store_id ? 'AND o.store_id = ?' : ''} ${dateFilter}`,
      store_id ? [store_id, ...params] : params
    );

    // Số khách hàng mới
    const [newCustomersResult] = await query(
      `SELECT COUNT(*) as new_customers FROM customers WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    // Sản phẩm bán chạy
    const [topProducts] = await query(
      `SELECT p.id, p.name, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status IN ('completed', 'processing') ${store_id ? 'AND o.store_id = ?' : ''} ${dateFilter}
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 5`,
      store_id ? [store_id, ...params] : params
    );

    return successResponse(res, {
      total_revenue: revenueResult.total_revenue,
      total_orders: revenueResult.total_orders,
      new_customers: newCustomersResult.new_customers,
      top_products: topProducts
    }, 'Lấy thống kê dashboard thành công');
  } catch (error) {
    next(error);
  }
};

// THỐNG KÊ DOANH THU THEO CHI NHÁNH
export const getRevenueByStore = async (req, res, next) => {
  try {
    const sql = `
      SELECT s.id, s.name, COALESCE(SUM(o.total_amount), 0) as revenue, COUNT(o.id) as order_count,
             (SELECT COUNT(*) FROM inventory WHERE store_id = s.id) as product_count
      FROM stores s
      LEFT JOIN orders o ON s.id = o.store_id AND o.status IN ('completed', 'processing')
      WHERE s.is_active = TRUE
      GROUP BY s.id
      ORDER BY revenue DESC
    `;

    const [data] = await query(sql);

    return successResponse(res, data, 'Lấy thống kê doanh thu theo chi nhánh thành công');
  } catch (error) {
    next(error);
  }
};

// THỐNG KÊ DOANH THU THEO DANH MỤC
export const getRevenueByCategory = async (req, res, next) => {
  try {
    const sql = `
      SELECT c.id, c.name, COALESCE(SUM(oi.subtotal), 0) as revenue, 
             SUM(oi.quantity) as quantity_sold, COUNT(DISTINCT o.id) as orders
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('completed', 'processing')
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY revenue DESC
    `;

    const [data] = await query(sql);

    return successResponse(res, data, 'Lấy thống kê doanh thu theo danh mục thành công');
  } catch (error) {
    next(error);
  }
};

// THỐNG KÊ DOANH THU THEO THỜI GIAN
export const getRevenueOverTime = async (req, res, next) => {
  try {
    const { period = 'day', store_id } = req.query;

    let dateFormat = '%Y-%m-%d';
    if (period === 'month') dateFormat = '%Y-%m';
    if (period === 'year') dateFormat = '%Y';

    let sql = `
      SELECT DATE_FORMAT(o.created_at, '${dateFormat}') as period,
             COALESCE(SUM(o.total_amount), 0) as revenue,
             COUNT(*) as orders
      FROM orders o
      WHERE o.status IN ('completed', 'processing')
    `;
    const params = [];

    if (store_id) {
      sql += ' AND o.store_id = ?';
      params.push(store_id);
    }

    sql += ` GROUP BY period ORDER BY period DESC`;

    const [data] = await query(sql, params);

    return successResponse(res, data, 'Lấy thống kê doanh thu theo thời gian thành công');
  } catch (error) {
    next(error);
  }
};

// THỐNG KÊ ĐƠN HÀNG THEO TRẠNG THÁI
export const getOrdersByStatus = async (req, res, next) => {
  try {
    const { store_id } = req.query;

    let sql = `
      SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE 1=1
    `;
    const params = [];

    if (store_id) {
      sql += ' AND store_id = ?';
      params.push(store_id);
    }

    sql += ' GROUP BY status';

    const [data] = await query(sql, params);

    return successResponse(res, data, 'Lấy thống kê đơn hàng theo trạng thái thành công');
  } catch (error) {
    next(error);
  }
};

// XUẤT BÁO CÁO (JSON -> có thể convert sang Excel)
export const exportReport = async (req, res, next) => {
  try {
    const { from_date, to_date, store_id, report_type = 'sales' } = req.query;

    let data = {};

    if (report_type === 'sales') {
      const sql = `
        SELECT o.id, o.total_amount, o.status, o.created_at, o.payment_method,
               s.name as store_name, c.name as customer_name
        FROM orders o
        JOIN stores s ON o.store_id = s.id
        JOIN customers c ON o.user_id = c.user_id
        WHERE o.status IN ('completed', 'processing')
        ${from_date && to_date ? 'AND o.created_at BETWEEN ? AND ?' : ''}
        ${store_id ? 'AND o.store_id = ?' : ''}
        ORDER BY o.created_at DESC
      `;

      const params = [];
      if (from_date && to_date) params.push(from_date, to_date);
      if (store_id) params.push(store_id);

      const [orders] = await query(sql, params);
      data = { orders };
    } else if (report_type === 'inventory') {
      const sql = `
        SELECT i.id, p.name, p.sku, i.quantity, i.reorder_level,
               s.name as store_name, p.price,
               (i.quantity * p.price) as inventory_value
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN stores s ON i.store_id = s.id
        WHERE 1=1 ${store_id ? 'AND i.store_id = ?' : ''}
        ORDER BY s.name, p.name
      `;

      const [inventory] = await query(sql, store_id ? [store_id] : []);
      data = { inventory };
    }

    return successResponse(res, data, 'Xuất báo cáo thành công');
  } catch (error) {
    next(error);
  }
};
