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

import { sendGet } from "./axios";

// Revenue Reports APIs
export const getRevenueByStore = async (
  params: IRevenueByStoreFilter = {}
): Promise<IRevenueByStoreResponse> => {
  const res = await sendGet("/stats/revenue/by-store", params);
  return res as IRevenueByStoreResponse;
};

export const getRevenueByCategory = async (
  params: IRevenueByCategoryFilter = {}
): Promise<IRevenueByCategoryResponse> => {
  const res = await sendGet("/stats/revenue/by-category", params);
  return res as IRevenueByCategoryResponse;
};

export const getRevenueOverTime = async (
  params: IRevenueOverTimeFilter = {}
): Promise<IRevenueOverTimeResponse> => {
  const res = await sendGet("/stats/revenue/over-time", params);
  return res as IRevenueOverTimeResponse;
};

export const getDashboard = async (
  params: IDashboardFilter = {}
): Promise<IDashboardResponse> => {
  const res = await sendGet("/stats/dashboard", params);
  return res as IDashboardResponse;
};

// Cost Reports APIs
export const getCostReport = async (
  params: ICostReportFilter = {}
): Promise<ICostReportResponse> => {
  const res = await sendGet("/stats/cost", params);
  return res as ICostReportResponse;
};

export const exportReport = async (
  params: IExportReportFilter
): Promise<IExportReportResponse> => {
  const res = await sendGet("/stats/export", params);
  return res as IExportReportResponse;
};

// Inventory Reports APIs
export const getInventoryByStore = async (
  params: IInventoryByStoreFilter
): Promise<IInventoryByStoreResponse> => {
  const res = await sendGet("/inventory/by-store", params);
  return res as IInventoryByStoreResponse;
};

export const getLowStock = async (
  params: ILowStockFilter
): Promise<ILowStockResponse> => {
  const res = await sendGet("/inventory/low-stock", params);
  return res as ILowStockResponse;
};

export const getInventoryLogs = async (
  params: IInventoryLogsFilter = {}
): Promise<IInventoryLogsResponse> => {
  const res = await sendGet("/inventory/logs", params);
  return res as IInventoryLogsResponse;
};

export const getCustomers = async (
  params: ICustomersFilter = {}
): Promise<ICustomersResponse> => {
  const res = await sendGet("/customers", params);
  return res as ICustomersResponse;
};

export const getVipCustomers = async (
  params: IVipCustomersFilter = {}
): Promise<IVipCustomersResponse> => {
  const res = await sendGet("/customers/vip/list", params);
  return res as IVipCustomersResponse;
};

export const getCustomerDetail = async (
  customerId: string | number
): Promise<ICustomerDetailResponse> => {
  const res = await sendGet(`/customers/${customerId}`);
  return res as ICustomerDetailResponse;
};

// Order Reports APIs
export const getOrdersByStatus = async (
  params: IOrdersByStatusFilter = {}
): Promise<IOrdersByStatusResponse> => {
  const res = await sendGet("/stats/orders/by-status", params);
  return res as IOrdersByStatusResponse;
};

// Review Reports APIs
export const getReviewsStats = async (
  params: IReviewsStatsFilter = {}
): Promise<IReviewsStatsResponse> => {
  const res = await sendGet("/stats/reviews", params);
  return res as IReviewsStatsResponse;
};

// Profit Reports APIs
export const getProfitReport = async (
  params: IProfitReportFilter = {}
): Promise<IProfitReportResponse> => {
  const res = await sendGet("/stats/profit", params);
  return res as IProfitReportResponse;
};
