import { sendDelete, sendGet, sendPost, sendPut } from "./axios";
import {
  IStoreCreateRequest,
  IStoreListParams,
  IStoreUpdateRequest,
} from "@/interface/request/store";
import {
  IStoreDeleteResponse,
  IStoreDetailResponse,
  IStoreDropdownResponse,
  IStoreListResponse,
  IStoreMutationResponse,
} from "@/interface/response/store";

const normalizeStoreParams = (params: IStoreListParams = {}): Record<string, any> => {
  const query: Record<string, any> = {};

  if (params.page !== undefined) query.page = params.page;
  if (params.limit !== undefined) query.limit = params.limit;
  if (params.search) query.search = params.search;
  if (params.city) query.city = params.city;
  if (params.district) query.district = params.district;

  if (params.is_active !== undefined) {
    query.is_active =
      typeof params.is_active === "boolean" ? String(params.is_active) : params.is_active;
  }

  return query;
};

export const getStores = async (
  params: IStoreListParams = {},
): Promise<IStoreListResponse> => {
  const query = normalizeStoreParams(params);
  const res = await sendGet("/stores", query);

  const rawData = res?.data;
  const stores: IStoreListResponse["data"] = Array.isArray(rawData)
    ? rawData
    : rawData
    ? [rawData]
    : [];

  return {
    success: !!res?.success,
    message: res?.message ?? "",
    data: stores,
    pagination: res?.pagination,
  };
};

export const getStoresDropdown = async (): Promise<IStoreDropdownResponse> => {
  const res = await sendGet("/stores/dropdown");
  const rawData = res?.data;
  const dropdownData: IStoreDropdownResponse["data"] = Array.isArray(rawData)
    ? rawData
    : rawData
    ? [rawData]
    : [];

  return {
    success: !!res?.success,
    message: res?.message ?? "",
    data: dropdownData,
  };
};

export const getStoreDetail = async (storeId: number | string): Promise<IStoreDetailResponse> => {
  return sendGet(`/stores/${storeId}`);
};

export const createStore = async (
  payload: IStoreCreateRequest,
): Promise<IStoreMutationResponse> => {
  return sendPost("/stores", payload);
};

export const updateStore = async (
  storeId: number | string,
  payload: IStoreUpdateRequest,
): Promise<IStoreMutationResponse> => {
  return sendPut(`/stores/${storeId}`, payload);
};

export const deleteStore = async (storeId: number | string): Promise<IStoreDeleteResponse> => {
  return sendDelete(`/stores/${storeId}`);
};

