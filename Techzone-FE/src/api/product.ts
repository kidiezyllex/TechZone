import {
  IProductFilter,
  IProductCreate,
  IProductUpdate,
  IProductStatusUpdate,
  IProductStockUpdate,
  IProductImageUpdate,
  IProductSearchParams
} from "@/interface/request/product";

import {
  IProductsResponse,
  IProductResponse,
  IActionResponse,
  IProductFiltersResponse,
  IProduct,
  IPopulatedProductVariant,
} from "@/interface/response/product";

import { sendGet, sendPost, sendPut, sendPatch, sendDelete } from "./axios";

const mapApiProductToProduct = (p: any): IProduct => {
  const sellingPrice = p.selling_price ? Number(p.selling_price) : 0;
  const variant: IPopulatedProductVariant = {
    id: p.id?.toString() ?? "",
    colorId: "",
    sizeId: "",
    color: { id: "", name: "", code: "" },
    size: { id: "", value: 0 },
    price: sellingPrice,
    stock: p.total_stock != null ? Number(p.total_stock) : 0,
    images: [],
  };

  return {
    id: p.id?.toString() ?? "",
    code: p.sku ?? "",
    name: p.name ?? "",
    brand: p.brand_name ?? "",
    category: p.category_name ?? "",
    material: "",
    description: p.description ?? "",
    weight: 0,
    variants: [variant],
    status: p.is_active === 1 ? "ACTIVE" : "INACTIVE",
    createdAt: p.created_at ?? "",
    updatedAt: p.updated_at ?? "",
    price: sellingPrice,
  };
};

const convertParamsToQueryString = (params: any): any => {
  const formattedParams: any = {};

  for (const key in params) {
    if (params[key] !== undefined) {
      if (Array.isArray(params[key])) {
        formattedParams[key] = params[key].join(',');
      } else {
        formattedParams[key] = params[key];
      }
    }
  }

  return formattedParams;
};

export const getAllProducts = async (params: IProductFilter): Promise<IProductsResponse> => {
  const formattedParams = convertParamsToQueryString(params);
  const res = await sendGet("/products", formattedParams);

  const products = Array.isArray(res.data) ? res.data.map(mapApiProductToProduct) : [];
  const pagination = res.pagination || {};

  const totalItems =
    typeof pagination.totalItems === "number"
      ? pagination.totalItems
      : products.length;

  const totalPages =
    typeof pagination.totalPages === "number" && pagination.totalPages !== null
      ? pagination.totalPages
      : 1;

  return {
    success: !!res.success,
    message: res.message ?? "",
    data: {
      products,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pagination.page ?? params.page ?? 1,
        limit: pagination.limit ?? params.limit ?? (products.length || 10),
      },
    },
  };
};

export const getProductById = async (productId: string): Promise<IProductResponse> => {
  const res = await sendGet(`/products/${productId}`);
  return res as IProductResponse;
};

export const createProduct = async (payload: IProductCreate): Promise<IProductResponse> => {
  const res = await sendPost("/products", payload);
  return res as IProductResponse;
};

export const updateProduct = async (
  productId: string,
  payload: IProductUpdate
): Promise<IProductResponse> => {
  const res = await sendPut(`/products/${productId}`, payload);
  return res as IProductResponse;
};

export const updateProductStatus = async (
  productId: string,
  payload: IProductStatusUpdate
): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/status`, payload);
  return res as IProductResponse;
};

export const updateProductStock = async (
  productId: string,
  payload: IProductStockUpdate
): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/stock`, payload);
  return res as IProductResponse;
};

export const updateProductImages = async (
  productId: string,
  payload: IProductImageUpdate
): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/images`, payload);
  return res as IProductResponse;
};

export const deleteProduct = async (productId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/products/${productId}`);
  return res as IActionResponse;
};

export const searchProducts = async (params: IProductSearchParams): Promise<IProductsResponse> => {
  const formattedParams = convertParamsToQueryString(params);
  const res = await sendGet("/products/search", formattedParams);
  return res as IProductsResponse;
};

export const getAllFilters = async (): Promise<IProductFiltersResponse> => {
  const res = await sendGet("/products/filters");
  return res as IProductFiltersResponse;
};
