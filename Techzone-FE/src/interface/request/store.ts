export interface IStoreListParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean | string;
  city?: string;
  district?: string;
}

export interface IStoreCreateRequest {
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  manager_id: number;
  is_active?: boolean;
}

export interface IStoreUpdateRequest {
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  phone?: string;
  manager_id?: number;
  is_active?: boolean;
}

