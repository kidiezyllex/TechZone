export interface IRevenueByStoreFilter {
}

export interface IRevenueByCategoryFilter {
}

export interface IRevenueOverTimeFilter {
  period?: 'day' | 'month' | 'year';
  store_id?: number;
}

export interface IDashboardFilter {
  store_id?: number;
  from_date?: string;
  to_date?: string;
}

export interface ICostReportFilter {
  store_id?: number;
  from_date?: string;
  to_date?: string;
  period?: 'day' | 'month' | 'year';
}

export interface IExportReportFilter {
  report_type: 'sales' | 'inventory';
  from_date?: string;
  to_date?: string;
  store_id?: number;
}

export interface IInventoryByStoreFilter {
  store_id: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ILowStockFilter {
  store_id: number;
}

export interface IInventoryLogsFilter {
  store_id?: number;
  product_id?: number;
  page?: number;
  limit?: number;
}

export interface ICustomersFilter {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: 'total_spent' | 'total_orders' | 'created_at';
}

export interface IVipCustomersFilter {
  limit?: number;
}

export interface ICustomerDetailFilter {
}

export interface IOrdersByStatusFilter {
  store_id?: number;
}

export interface IReviewsStatsFilter {
  product_id?: number;
  from_date?: string; 
  to_date?: string; 
  min_rating?: number; 
}

export interface IProfitReportFilter {
  store_id?: number;
  from_date?: string; 
  to_date?: string;  
  period?: 'day' | 'month' | 'year';
} 