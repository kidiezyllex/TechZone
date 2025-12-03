// Revenue Reports Responses
export interface IRevenueByStoreItem {
  id: number;
  name: string;
  revenue: number;
  order_count: number;
  product_count: number;
}

export interface IRevenueByStoreResponse {
  success: boolean;
  message: string;
  data: IRevenueByStoreItem[];
}

export interface IRevenueByCategoryItem {
  id: number;
  name: string;
  revenue: number;
  quantity_sold: number;
  orders: number;
}

export interface IRevenueByCategoryResponse {
  success: boolean;
  message: string;
  data: IRevenueByCategoryItem[];
}

export interface IRevenueOverTimeItem {
  period: string;
  revenue: number;
  orders: number;
}

export interface IRevenueOverTimeResponse {
  success: boolean;
  message: string;
  data: IRevenueOverTimeItem[];
}

export interface IDashboardTopProduct {
  id: number;
  name: string;
  total_sold: number;
  revenue: number;
}

export interface IDashboardData {
  total_revenue: number;
  total_orders: number;
  new_customers: number;
  top_products: IDashboardTopProduct[];
}

export interface IDashboardResponse {
  success: boolean;
  message: string;
  data: IDashboardData;
}

// Cost Reports Responses
export interface ICostSummaryItem {
  period: string;
  store_id: number;
  store_name: string;
  purchase_count: number;
  total_cost: number;
  received_count: number;
  pending_count: number;
  cancelled_count: number;
}

export interface ICostTopProduct {
  id: number;
  name: string;
  sku: string;
  total_quantity_purchased: number;
  total_cost: number;
  avg_purchase_price: number;
  purchase_times: number;
}

export interface ICostReportData {
  summary: ICostSummaryItem[];
  top_products: ICostTopProduct[];
}

export interface ICostReportResponse {
  success: boolean;
  message: string;
  data: ICostReportData;
}

export interface IExportOrder {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  store_name: string;
  customer_name: string;
}

export interface IExportInventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  reorder_level: number;
  store_name: string;
  price: number;
  inventory_value: number;
}

export interface IExportSalesData {
  orders: IExportOrder[];
}

export interface IExportInventoryData {
  inventory: IExportInventoryItem[];
}

export interface IExportReportResponse {
  success: boolean;
  message: string;
  data: IExportSalesData | IExportInventoryData;
}

// Inventory Reports Responses
export interface IInventoryByStoreItem {
  id: number;
  product_id: number;
  store_id: number;
  quantity: number;
  reorder_level: number;
  last_restocked: string;
  name: string;
  sku: string;
  price: number;
  category_name: string;
  store_name: string;
}

export interface IInventoryByStoreResponse {
  success: boolean;
  message: string;
  data: IInventoryByStoreItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ILowStockItem {
  id: number;
  product_id: number;
  quantity: number;
  reorder_level: number;
  name: string;
  sku: string;
  price: number;
  category_name: string;
}

export interface ILowStockResponse {
  success: boolean;
  message: string;
  data: ILowStockItem[];
}

export interface IInventoryLog {
  id: number;
  product_id: number;
  store_id: number;
  type: 'import' | 'export';
  quantity: number;
  created_at: string;
  product_name: string;
  store_name: string;
}

export interface IInventoryLogsResponse {
  success: boolean;
  message: string;
  data: IInventoryLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Customer Reports Responses
export interface ICustomer {
  id: number;
  user_id: number;
  classification: 'vip' | 'regular' | 'new' | null;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  notes: string | null;
  email: string;
  full_name: string;
  phone: string;
}

export interface ICustomersResponse {
  success: boolean;
  message: string;
  data: ICustomer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IVipCustomersResponse {
  success: boolean;
  message: string;
  data: ICustomer[];
}

export interface ICustomerRecentOrder {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface ICustomerDetail {
  id: number;
  user_id: number;
  classification: 'vip' | 'regular' | 'new' | null;
  total_orders: number;
  total_spent: number;
  email: string;
  full_name: string;
  phone: string;
  order_count: number;
  completed_orders: number;
  recent_orders: ICustomerRecentOrder[];
}

export interface ICustomerDetailResponse {
  success: boolean;
  message: string;
  data: ICustomerDetail;
}

// Order Reports Responses
export interface IOrdersByStatusItem {
  status: string;
  count: number;
  revenue: number;
}

export interface IOrdersByStatusResponse {
  success: boolean;
  message: string;
  data: IOrdersByStatusItem[];
}

// Review Reports Responses
export interface IReviewsSummary {
  total_reviews: number;
  avg_rating: string;
  rating_5: number;
  rating_4: number;
  rating_3: number;
  rating_2: number;
  rating_1: number;
  verified_reviews: number;
}

export interface IReviewsTopProduct {
  id: number;
  name: string;
  sku: string;
  review_count: number;
  avg_rating: string;
  five_star_count: number;
  verified_count: number;
}

export interface IReviewsTimeSeries {
  date: string;
  review_count: number;
  avg_rating: string;
}

export interface IReviewsRecentReview {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  is_verified: number;
  created_at: string;
  product_name: string;
  user_name: string;
}

export interface IReviewsStatsData {
  summary: IReviewsSummary;
  top_products: IReviewsTopProduct[];
  time_series: IReviewsTimeSeries[];
  recent_reviews: IReviewsRecentReview[];
}

export interface IReviewsStatsResponse {
  success: boolean;
  message: string;
  data: IReviewsStatsData;
}

// Profit Reports Responses
export interface IProfitDataItem {
  period: string;
  store_id: number;
  revenue: number;
  cost: number;
  profit: number;
  profit_margin: string;
  order_count: number;
}

export interface IProfitTotals {
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  total_profit_margin: string;
  total_orders: number;
}

export interface IProfitReportData {
  data: IProfitDataItem[];
  totals: IProfitTotals;
}

export interface IProfitReportResponse {
  success: boolean;
  message: string;
  data: IProfitReportData;
} 