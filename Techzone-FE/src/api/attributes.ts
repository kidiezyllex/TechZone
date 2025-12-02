import {
  IBrandFilter, IBrandCreate, IBrandUpdate,
  ICategoryFilter, ICategoryCreate, ICategoryUpdate,
} from "@/interface/request/attributes";

import {
  IBrandResponse, IBrandsResponse, IBrand,
  ICategoryResponse, ICategoriesResponse, ICategory,
  IActionResponse
} from "@/interface/response/attributes";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

const mapCategory = (category: any): ICategory => {
  return {
    id: category.id,
    name: category.name,
    status: category.is_active === 1 ? "ACTIVE" : "INACTIVE",
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  };
};

const mapBrand = (brand: any): IBrand => {
  return {
    id: brand.id,
    name: brand.name,
    status: brand.is_active === 1 ? "ACTIVE" : "INACTIVE",
    createdAt: brand.created_at,
    updatedAt: brand.updated_at,
  };
};

export const getAllBrands = async (params: IBrandFilter = {}): Promise<IBrandsResponse> => {
  const res = await sendGet("/categories/brands/all", params);

  return {
    success: res.success,
    message: res.message,
    data: Array.isArray(res.data) ? res.data.map(mapBrand) : [],
  };
};

export const getBrandById = async (brandId: string): Promise<IBrandResponse> => {
  const res = await sendGet(`/categories/brands/${brandId}`);

  return {
    success: res.success,
    message: res.message,
    data: res.data ? mapBrand(res.data) : (null as any),
  };
};

export const createBrand = async (payload: IBrandCreate): Promise<IBrandResponse> => {
  const res = await sendPost("/categories/brands", payload);

  return {
    success: res.success,
    message: res.message,
    data: res.data ? mapBrand(res.data) : (null as any),
  };
};

export const updateBrand = async (brandId: string, payload: IBrandUpdate): Promise<IBrandResponse> => {
  const res = await sendPut(`/categories/brands/${brandId}`, payload);

  return {
    success: res.success,
    message: res.message,
    data: res.data ? mapBrand(res.data) : (null as any),
  };
};

export const deleteBrand = async (brandId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/categories/brands/${brandId}`);
  return res as IActionResponse;
};

export const getAllCategories = async (params: ICategoryFilter = {}): Promise<ICategoriesResponse> => {
  const res = await sendGet("/categories", params);

  return {
    success: res.success,
    message: res.message,
    data: Array.isArray(res.data) ? res.data.map(mapCategory) : [],
  };
};

export const getCategoryById = async (categoryId: string): Promise<ICategoryResponse> => {
  const res = await sendGet(`/categories/${categoryId}`);

  return {
    success: res.success,
    message: res.message,
    data: res.data ? mapCategory(res.data) : (null as any),
  };
};

export const createCategory = async (payload: ICategoryCreate): Promise<ICategoryResponse> => {
  const res = await sendPost("/categories", payload);

  return {
    success: res.success,
    message: res.message,
    data: res.data ? mapCategory(res.data) : (null as any),
  };
};

export const updateCategory = async (categoryId: string, payload: ICategoryUpdate): Promise<ICategoryResponse> => {
  const res = await sendPut(`/categories/${categoryId}`, payload);

  return {
    success: res.success,
    message: res.message,
    data: res.data ? mapCategory(res.data) : (null as any),
  };
};

export const deleteCategory = async (categoryId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/categories/${categoryId}`);
  return res as IActionResponse;
};