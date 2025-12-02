import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";

import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/attributes";

import {
  IBrandFilter, IBrandCreate, IBrandUpdate,
  ICategoryFilter, ICategoryCreate, ICategoryUpdate,
} from "@/interface/request/attributes";

import {
  IBrandResponse, IBrandsResponse,
  ICategoryResponse, ICategoriesResponse,
} from "@/interface/response/attributes";

import { IActionResponse } from "@/interface/response/product";

export const useBrands = (params: IBrandFilter = {}): UseQueryResult<IBrandsResponse, Error> => {
  return useQuery<IBrandsResponse, Error>({
    queryKey: ["brands", params],
    queryFn: () => getAllBrands(params),
  });
};

export const useBrandDetail = (brandId: string): UseQueryResult<IBrandResponse, Error> => {
  return useQuery<IBrandResponse, Error>({
    queryKey: ["brand", brandId],
    queryFn: () => getBrandById(brandId),
    enabled: !!brandId,
  });
};

export const useCreateBrand = (): UseMutationResult<IBrandResponse, Error, IBrandCreate> => {
  return useMutation<IBrandResponse, Error, IBrandCreate>({
    mutationFn: (payload) => createBrand(payload),
  });
};

export const useUpdateBrand = (): UseMutationResult<
  IBrandResponse,
  Error,
  { brandId: string; payload: IBrandUpdate }
> => {
  return useMutation<IBrandResponse, Error, { brandId: string; payload: IBrandUpdate }>({
    mutationFn: ({ brandId, payload }) => updateBrand(brandId, payload),
  });
};

export const useDeleteBrand = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (brandId) => deleteBrand(brandId),
  });
};

export const useCategories = (params: ICategoryFilter = {}): UseQueryResult<ICategoriesResponse, Error> => {
  return useQuery<ICategoriesResponse, Error>({
    queryKey: ["categories", params],
    queryFn: () => getAllCategories(params),
  });
};

export const useCategoryDetail = (categoryId: string): UseQueryResult<ICategoryResponse, Error> => {
  return useQuery<ICategoryResponse, Error>({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = (): UseMutationResult<ICategoryResponse, Error, ICategoryCreate> => {
  return useMutation<ICategoryResponse, Error, ICategoryCreate>({
    mutationFn: (payload) => createCategory(payload),
  });
};

export const useUpdateCategory = (): UseMutationResult<
  ICategoryResponse,
  Error,
  { categoryId: string; payload: ICategoryUpdate }
> => {
  return useMutation<ICategoryResponse, Error, { categoryId: string; payload: ICategoryUpdate }>({
    mutationFn: ({ categoryId, payload }) => updateCategory(categoryId, payload),
  });
};

export const useDeleteCategory = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (categoryId) => deleteCategory(categoryId),
  });
};
