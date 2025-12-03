import {
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getRevenueByStore,
  getRevenueByCategory,
  getRevenueOverTime,
  getDashboard,
  getCostReport,
  exportReport,
  getInventoryByStore,
  getLowStock,
  getInventoryLogs,
  getCustomers,
  getVipCustomers,
  getCustomerDetail,
  getOrdersByStatus,
  getReviewsStats,
  getProfitReport,
} from "@/api/statistics";
import {
  IRevenueByStoreFilter,
  IRevenueByCategoryFilter,
  IRevenueOverTimeFilter,
  IDashboardFilter,
  ICostReportFilter,
  IExportReportFilter,
  IInventoryByStoreFilter,
  ILowStockFilter,
  IInventoryLogsFilter,
  ICustomersFilter,
  IVipCustomersFilter,
  IOrdersByStatusFilter,
  IReviewsStatsFilter,
  IProfitReportFilter,
} from "@/interface/request/statistics";
import {
  IRevenueByStoreResponse,
  IRevenueByCategoryResponse,
  IRevenueOverTimeResponse,
  IDashboardResponse,
  ICostReportResponse,
  IExportReportResponse,
  IInventoryByStoreResponse,
  ILowStockResponse,
  IInventoryLogsResponse,
  ICustomersResponse,
  IVipCustomersResponse,
  ICustomerDetailResponse,
  IOrdersByStatusResponse,
  IReviewsStatsResponse,
  IProfitReportResponse,
} from "@/interface/response/statistics";

// Revenue Reports Hooks
export const useRevenueByStore = (params: IRevenueByStoreFilter = {}): UseQueryResult<IRevenueByStoreResponse, Error> => {
  return useQuery<IRevenueByStoreResponse, Error>({
    queryKey: ["revenueByStore", params],
    queryFn: () => getRevenueByStore(params),
  });
};

export const useRevenueByCategory = (params: IRevenueByCategoryFilter = {}): UseQueryResult<IRevenueByCategoryResponse, Error> => {
  return useQuery<IRevenueByCategoryResponse, Error>({
    queryKey: ["revenueByCategory", params],
    queryFn: () => getRevenueByCategory(params),
  });
};

export const useRevenueOverTime = (params: IRevenueOverTimeFilter = {}): UseQueryResult<IRevenueOverTimeResponse, Error> => {
  return useQuery<IRevenueOverTimeResponse, Error>({
    queryKey: ["revenueOverTime", params],
    queryFn: () => getRevenueOverTime(params),
  });
};

export const useDashboard = (params: IDashboardFilter = {}): UseQueryResult<IDashboardResponse, Error> => {
  return useQuery<IDashboardResponse, Error>({
    queryKey: ["dashboard", params],
    queryFn: () => getDashboard(params),
  });
};

// Cost Reports Hooks
export const useCostReport = (params: ICostReportFilter = {}): UseQueryResult<ICostReportResponse, Error> => {
  return useQuery<ICostReportResponse, Error>({
    queryKey: ["costReport", params],
    queryFn: () => getCostReport(params),
  });
};

export const useExportReport = (params: IExportReportFilter): UseQueryResult<IExportReportResponse, Error> => {
  return useQuery<IExportReportResponse, Error>({
    queryKey: ["exportReport", params],
    queryFn: () => exportReport(params),
    enabled: !!params.report_type,
  });
};

// Inventory Reports Hooks
export const useInventoryByStore = (params: IInventoryByStoreFilter): UseQueryResult<IInventoryByStoreResponse, Error> => {
  return useQuery<IInventoryByStoreResponse, Error>({
    queryKey: ["inventoryByStore", params],
    queryFn: () => getInventoryByStore(params),
    enabled: !!params.store_id,
  });
};

export const useLowStock = (params: ILowStockFilter): UseQueryResult<ILowStockResponse, Error> => {
  return useQuery<ILowStockResponse, Error>({
    queryKey: ["lowStock", params],
    queryFn: () => getLowStock(params),
    enabled: !!params.store_id,
  });
};

export const useInventoryLogs = (params: IInventoryLogsFilter = {}): UseQueryResult<IInventoryLogsResponse, Error> => {
  return useQuery<IInventoryLogsResponse, Error>({
    queryKey: ["inventoryLogs", params],
    queryFn: () => getInventoryLogs(params),
  });
};

// Customer Reports Hooks
export const useCustomers = (params: ICustomersFilter = {}): UseQueryResult<ICustomersResponse, Error> => {
  return useQuery<ICustomersResponse, Error>({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
  });
};

export const useVipCustomers = (params: IVipCustomersFilter = {}): UseQueryResult<IVipCustomersResponse, Error> => {
  return useQuery<IVipCustomersResponse, Error>({
    queryKey: ["vipCustomers", params],
    queryFn: () => getVipCustomers(params),
  });
};

export const useCustomerDetail = (customerId: string | number): UseQueryResult<ICustomerDetailResponse, Error> => {
  return useQuery<ICustomerDetailResponse, Error>({
    queryKey: ["customerDetail", customerId],
    queryFn: () => getCustomerDetail(customerId),
    enabled: !!customerId,
  });
};

// Order Reports Hooks
export const useOrdersByStatus = (params: IOrdersByStatusFilter = {}): UseQueryResult<IOrdersByStatusResponse, Error> => {
  return useQuery<IOrdersByStatusResponse, Error>({
    queryKey: ["ordersByStatus", params],
    queryFn: () => getOrdersByStatus(params),
  });
};

// Review Reports Hooks
export const useReviewsStats = (params: IReviewsStatsFilter = {}): UseQueryResult<IReviewsStatsResponse, Error> => {
  return useQuery<IReviewsStatsResponse, Error>({
    queryKey: ["reviewsStats", params],
    queryFn: () => getReviewsStats(params),
  });
};

// Profit Reports Hooks
export const useProfitReport = (params: IProfitReportFilter = {}): UseQueryResult<IProfitReportResponse, Error> => {
  return useQuery<IProfitReportResponse, Error>({
    queryKey: ["profitReport", params],
    queryFn: () => getProfitReport(params),
  });
}; 