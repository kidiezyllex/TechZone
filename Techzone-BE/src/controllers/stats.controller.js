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
        SELECT 
          o.id,
          o.total_amount,
          o.status,
          o.created_at,
          o.payment_method,
          s.name AS store_name,
          u.full_name AS customer_name
        FROM orders o
        JOIN stores s ON o.store_id = s.id
        JOIN customers c ON o.customer_id = c.id
        JOIN users u ON c.user_id = u.id
        WHERE o.status IN ('completed', 'processing')
        ${from_date && to_date ? 'AND o.created_at BETWEEN ? AND ?' : ''}
        ${store_id ? 'AND o.store_id = ?' : ''}
        ORDER BY o.created_at DESC
      `;

      const params = [];
      if (from_date && to_date) params.push(from_date, to_date);
      if (store_id) params.push(store_id);

      const orders = await query(sql, params);
      data = { orders };
    } else if (report_type === 'inventory') {
      const sql = `
        SELECT 
          i.id,
          p.name,
          p.sku,
          i.quantity,
          i.reserved_quantity,
          s.name AS store_name,
          p.selling_price AS price,
          (i.quantity * p.selling_price) AS inventory_value
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN stores s ON i.store_id = s.id
        WHERE 1=1 ${store_id ? 'AND i.store_id = ?' : ''}
        ORDER BY s.name, p.name
      `;

      const inventory = await query(sql, store_id ? [store_id] : []);
      data = { inventory };
    }

    return successResponse(res, data, 'Xuất báo cáo thành công');
  } catch (error) {
    next(error);
  }
};

// BÁO CÁO CHI PHÍ NHẬP HÀNG
export const getCostReport = async (req, res, next) => {
  try {
    const { store_id, from_date, to_date, period = 'day' } = req.query;

    let dateFormat = '%Y-%m-%d';
    if (period === 'month') dateFormat = '%Y-%m';
    if (period === 'year') dateFormat = '%Y';

    let sql = `
      SELECT 
        DATE_FORMAT(po.created_at, '${dateFormat}') as period,
        s.id as store_id,
        s.name as store_name,
        COUNT(po.id) as purchase_count,
        COALESCE(SUM(po.total_amount), 0) as total_cost,
        COUNT(CASE WHEN po.status = 'received' THEN 1 END) as received_count,
        COUNT(CASE WHEN po.status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN po.status = 'cancelled' THEN 1 END) as cancelled_count
      FROM purchase_orders po
      JOIN stores s ON po.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (store_id) {
      sql += ' AND po.store_id = ?';
      params.push(store_id);
    }

    if (from_date && to_date) {
      sql += ' AND po.created_at BETWEEN ? AND ?';
      params.push(from_date, to_date);
    }

    sql += ' GROUP BY period, s.id ORDER BY period DESC, s.id';

    const [data] = await query(sql, params);

    // Tổng hợp theo sản phẩm
    let productSql = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        SUM(poi.quantity) as total_quantity_purchased,
        SUM(poi.quantity * poi.unit_price) as total_cost,
        AVG(poi.unit_price) as avg_purchase_price,
        COUNT(DISTINCT poi.purchase_order_id) as purchase_times
      FROM purchase_order_items poi
      JOIN products p ON poi.product_id = p.id
      JOIN purchase_orders po ON poi.purchase_order_id = po.id
      WHERE 1=1
    `;
    const productParams = [];

    if (store_id) {
      productSql += ' AND po.store_id = ?';
      productParams.push(store_id);
    }

    if (from_date && to_date) {
      productSql += ' AND po.created_at BETWEEN ? AND ?';
      productParams.push(from_date, to_date);
    }

    productSql += ' GROUP BY p.id ORDER BY total_cost DESC LIMIT 20';

    const [topProducts] = await query(productSql, productParams);

    return successResponse(res, {
      summary: data,
      top_products: topProducts
    }, 'Lấy báo cáo chi phí thành công');
  } catch (error) {
    next(error);
  }
};

// BÁO CÁO LỢI NHUẬN (Profit = Revenue - Cost)
export const getProfitReport = async (req, res, next) => {
  try {
    const { store_id, from_date, to_date, period = 'day' } = req.query;

    let dateFormat = '%Y-%m-%d';
    if (period === 'month') dateFormat = '%Y-%m';
    if (period === 'year') dateFormat = '%Y';

    // Tính doanh thu từ orders
    let revenueSql = `
      SELECT 
        DATE_FORMAT(o.created_at, '${dateFormat}') as period,
        o.store_id,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COUNT(o.id) as order_count
      FROM orders o
      WHERE o.status IN ('completed', 'processing')
    `;
    const revenueParams = [];

    if (store_id) {
      revenueSql += ' AND o.store_id = ?';
      revenueParams.push(store_id);
    }

    if (from_date && to_date) {
      revenueSql += ' AND o.created_at BETWEEN ? AND ?';
      revenueParams.push(from_date, to_date);
    }

    revenueSql += ' GROUP BY period, o.store_id';

    const revenueData = await query(revenueSql, revenueParams);

    // Tính chi phí từ purchase_orders
    let costSql = `
      SELECT 
        DATE_FORMAT(po.created_at, '${dateFormat}') as period,
        po.store_id,
        COALESCE(SUM(po.total_amount), 0) as cost
      FROM purchase_orders po
      WHERE po.status = 'received'
    `;
    const costParams = [];

    if (store_id) {
      costSql += ' AND po.store_id = ?';
      costParams.push(store_id);
    }

    if (from_date && to_date) {
      costSql += ' AND po.created_at BETWEEN ? AND ?';
      costParams.push(from_date, to_date);
    }

    costSql += ' GROUP BY period, po.store_id';

    const costData = await query(costSql, costParams);

    // Kết hợp dữ liệu
    const profitMap = {};
    
    revenueData.forEach(item => {
      const key = `${item.period}_${item.store_id || 'null'}`;
      if (!profitMap[key]) {
        profitMap[key] = {
          period: item.period,
          store_id: item.store_id,
          revenue: parseFloat(item.revenue) || 0,
          cost: 0,
          profit: 0,
          order_count: item.order_count || 0
        };
      } else {
        profitMap[key].revenue += parseFloat(item.revenue) || 0;
        profitMap[key].order_count += item.order_count || 0;
      }
    });

    costData.forEach(item => {
      const key = `${item.period}_${item.store_id || 'null'}`;
      if (!profitMap[key]) {
        profitMap[key] = {
          period: item.period,
          store_id: item.store_id,
          revenue: 0,
          cost: parseFloat(item.cost) || 0,
          profit: 0,
          order_count: 0
        };
      } else {
        profitMap[key].cost += parseFloat(item.cost) || 0;
      }
    });

    // Tính profit và format
    const profitData = Object.values(profitMap).map((item) => {
      item.profit = item.revenue - item.cost;
      item.profit_margin = item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(2) : 0;
      return item;
    });

    // Sắp xếp theo period
    profitData.sort((a, b) => {
      if (a.period !== b.period) {
        return b.period.localeCompare(a.period);
      }
      return (a.store_id || 0) - (b.store_id || 0);
    });

    // Tính tổng
    const totals = profitData.reduce((acc, item) => {
      acc.total_revenue += item.revenue;
      acc.total_cost += item.cost;
      acc.total_profit += item.profit;
      acc.total_orders += item.order_count;
      return acc;
    }, { total_revenue: 0, total_cost: 0, total_profit: 0, total_orders: 0 });

    totals.total_profit_margin = totals.total_revenue > 0 
      ? ((totals.total_profit / totals.total_revenue) * 100).toFixed(2) 
      : 0;

    return successResponse(res, {
      data: profitData,
      totals
    }, 'Lấy báo cáo lợi nhuận thành công');
  } catch (error) {
    next(error);
  }
};

// THỐNG KÊ ĐÁNH GIÁ SẢN PHẨM
export const getReviewStats = async (req, res, next) => {
  try {
    const { product_id, from_date, to_date, min_rating } = req.query;

    // Thống kê tổng quan
    let summarySql = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as avg_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1,
        COUNT(CASE WHEN is_verified = 1 THEN 1 END) as verified_reviews
      FROM reviews
      WHERE 1=1
    `;
    const summaryParams = [];

    if (product_id) {
      summarySql += ' AND product_id = ?';
      summaryParams.push(product_id);
    }

    if (from_date && to_date) {
      summarySql += ' AND created_at BETWEEN ? AND ?';
      summaryParams.push(from_date, to_date);
    }

    if (min_rating) {
      summarySql += ' AND rating >= ?';
      summaryParams.push(min_rating);
    }

    const [summary] = await query(summarySql, summaryParams);

    // Top sản phẩm được đánh giá tốt nhất
    let topProductsSql = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        COUNT(r.id) as review_count,
        AVG(r.rating) as avg_rating,
        COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN r.is_verified = 1 THEN 1 END) as verified_count
      FROM products p
      JOIN reviews r ON p.id = r.product_id
      WHERE 1=1
    `;
    const topProductsParams = [];

    if (from_date && to_date) {
      topProductsSql += ' AND r.created_at BETWEEN ? AND ?';
      topProductsParams.push(from_date, to_date);
    }

    topProductsSql += `
      GROUP BY p.id
      HAVING review_count > 0
      ORDER BY avg_rating DESC, review_count DESC
      LIMIT 20
    `;

    const topProducts = await query(topProductsSql, topProductsParams);

    // Đánh giá theo thời gian
    let timeSeriesSql = `
      SELECT 
        DATE_FORMAT(r.created_at, '%Y-%m-%d') as date,
        COUNT(*) as review_count,
        AVG(rating) as avg_rating
      FROM reviews r
      WHERE 1=1
    `;
    const timeSeriesParams = [];

    if (product_id) {
      timeSeriesSql += ' AND r.product_id = ?';
      timeSeriesParams.push(product_id);
    }

    if (from_date && to_date) {
      timeSeriesSql += ' AND r.created_at BETWEEN ? AND ?';
      timeSeriesParams.push(from_date, to_date);
    }

    timeSeriesSql += ' GROUP BY date ORDER BY date DESC LIMIT 30';

    const timeSeries = await query(timeSeriesSql, timeSeriesParams);

    // Đánh giá mới nhất
    let recentReviewsSql = `
      SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.comment,
        r.is_verified,
        r.created_at,
        p.name as product_name,
        u.full_name as user_name
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const recentReviewsParams = [];

    if (product_id) {
      recentReviewsSql += ' AND r.product_id = ?';
      recentReviewsParams.push(product_id);
    }

    if (from_date && to_date) {
      recentReviewsSql += ' AND r.created_at BETWEEN ? AND ?';
      recentReviewsParams.push(from_date, to_date);
    }

    recentReviewsSql += ' ORDER BY r.created_at DESC LIMIT 10';

    const recentReviews = await query(recentReviewsSql, recentReviewsParams);

    return successResponse(res, {
      summary: {
        ...summary,
        avg_rating: summary.avg_rating ? parseFloat(summary.avg_rating).toFixed(2) : 0
      },
      top_products: topProducts.map((p) => ({
        ...p,
        avg_rating: parseFloat(p.avg_rating).toFixed(2)
      })),
      time_series: timeSeries.map((t) => ({
        ...t,
        avg_rating: parseFloat(t.avg_rating).toFixed(2)
      })),
      recent_reviews: recentReviews
    }, 'Lấy thống kê đánh giá thành công');
  } catch (error) {
    next(error);
  }
};