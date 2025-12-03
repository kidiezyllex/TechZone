import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  createStore,
  deleteStore,
  getStoreDetail,
  getStores,
  getStoresDropdown,
  updateStore,
} from "@/api/store";
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

export const useStores = (
  params: IStoreListParams = {},
): UseQueryResult<IStoreListResponse, Error> => {
  return useQuery<IStoreListResponse, Error, IStoreListResponse, ["stores", IStoreListParams]>({
    queryKey: ["stores", params],
    queryFn: ({ queryKey }) => getStores(queryKey[1]),
    refetchOnWindowFocus: false,
  });
};

export const useStoreDropdown = (): UseQueryResult<IStoreDropdownResponse, Error> => {
  return useQuery<IStoreDropdownResponse, Error>({
    queryKey: ["stores", "dropdown"],
    queryFn: () => getStoresDropdown(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useStoreDetail = (
  storeId?: number | string,
): UseQueryResult<IStoreDetailResponse, Error> => {
  return useQuery<IStoreDetailResponse, Error>({
    queryKey: ["store-detail", storeId],
    queryFn: () => getStoreDetail(storeId as string | number),
    enabled: !!storeId,
    refetchOnWindowFocus: false,
  });
};

export const useCreateStore = (): UseMutationResult<
  IStoreMutationResponse,
  Error,
  IStoreCreateRequest
> => {
  return useMutation<IStoreMutationResponse, Error, IStoreCreateRequest>({
    mutationFn: (payload) => createStore(payload),
  });
};

export const useUpdateStore = (): UseMutationResult<
  IStoreMutationResponse,
  Error,
  { storeId: number | string; payload: IStoreUpdateRequest }
> => {
  return useMutation<
    IStoreMutationResponse,
    Error,
    { storeId: number | string; payload: IStoreUpdateRequest }
  >({
    mutationFn: ({ storeId, payload }) => updateStore(storeId, payload),
  });
};

export const useDeleteStore = (): UseMutationResult<
  IStoreDeleteResponse,
  Error,
  number | string
> => {
  return useMutation<IStoreDeleteResponse, Error, number | string>({
    mutationFn: (storeId) => deleteStore(storeId),
  });
};

