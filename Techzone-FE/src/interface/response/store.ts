export interface IStore {
  id: number;
  name: string;
  address: string;
  city: string;
  district?: string;
  phone: string;
  email?: string;
  google_maps_url?: string;
  manager_id?: number;
  manager_name?: string;
  total_products?: number;
  total_staff?: number;
  total_orders?: number;
  total_inventory?: number;
  is_active: boolean | number;
  created_at: string;
  updated_at?: string;
}

export interface IStoreListResponse {
  success: boolean;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
  data: IStore[];
}

export interface IStoreDropdownItem {
  id: number;
  name: string;
}

export interface IStoreDropdownResponse {
  success: boolean;
  message: string;
  data: IStoreDropdownItem[];
}

export interface IStoreDetailResponse {
  success: boolean;
  message: string;
  data: IStore;
}

export interface IStoreMutationResponse {
  success: boolean;
  message: string;
  data: IStore;
}

export interface IStoreDeleteResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

