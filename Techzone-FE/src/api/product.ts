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
  IProductImage,
} from "@/interface/response/product";

import { sendGet, sendPost, sendPut, sendPatch, sendDelete } from "./axios";

const mapApiProductToProduct = (p: any): IProduct => {
  const basePrice = p.base_price ? Number(p.base_price) : 0;
  const sellingPrice = p.selling_price ? Number(p.selling_price) : 0;
  const discountPrice = p.discount_price ? Number(p.discount_price) : null;

  const images: IProductImage[] = Array.isArray(p.images)
    ? p.images.map((img: any) => ({
        id: img.id ?? 0,
        imageUrl: img.image_url ?? img.imageUrl ?? "",
      }))
    : [];

  const totalStock =
    p.total_stock != null && p.total_stock !== null
      ? Number(p.total_stock)
      : Array.isArray(p.inventory)
      ? p.inventory.reduce(
          (sum: number, item: any) => sum + (Number(item.quantity) || 0),
          0
        )
      : 0;

  const inventory = Array.isArray(p.inventory)
    ? p.inventory.map((item: any) => ({
        storeId: item.store_id?.toString() ?? "",
        storeName: item.store_name ?? "",
        quantity: Number(item.quantity) || 0,
        reservedQuantity: Number(item.reserved_quantity) || 0,
        updatedAt: item.updated_at ?? "",
      }))
    : [];

  const variant: IPopulatedProductVariant = {
    id: p.id?.toString() ?? "",
    colorId: "",
    sizeId: "",
    color: { id: "", name: "", code: "" },
    size: { id: "", value: 0 },
    price: discountPrice || sellingPrice || basePrice,
    stock: totalStock,
    images,
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
    price: discountPrice || sellingPrice || basePrice,
    specifications: p.specifications ?? "",
    basePrice,
    sellingPrice,
    discountPrice: discountPrice || undefined,
    totalStock,
    images,
    inventory,
    avgRating: p.avg_rating ? Number(p.avg_rating) : undefined,
    reviewCount: p.review_count != null ? Number(p.review_count) : undefined,
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

  // Handle new API structure: data is directly an array, pagination is at root level
  const products = Array.isArray(res.data) ? res.data.map(mapApiProductToProduct) : [];
  const pagination = res.pagination || {};

  const currentPage = pagination.page ?? params.page ?? 1;
  const limit = pagination.limit ?? params.limit ?? 10;
  // Handle null totalPages - if null, calculate from products length and limit
  const totalPages = pagination.totalPages != null && pagination.totalPages !== null 
    ? pagination.totalPages 
    : Math.ceil(products.length / limit) || 1;
  const totalItems = pagination.totalItems ?? products.length;

  return {
    success: !!res.success,
    message: res.message ?? "",
    data: {
      products,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        limit,
      },
    },
  };
};

export const getProductById = async (productId: string): Promise<IProductResponse> => {
  const res = await sendGet(`/products/${productId}`);
  const product = res?.data ? mapApiProductToProduct(res.data) : (null as any);

  return {
    success: !!res.success,
    message: res.message ?? "",
    data: product,
  };
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
