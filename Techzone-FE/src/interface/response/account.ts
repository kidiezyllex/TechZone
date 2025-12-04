import { IBaseResponse } from './authentication';
import { IAddress } from '../request/account';

export interface IAccount {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  is_active: number; // 1 for active, 0 for inactive
  created_at: string;
  store_id: number | null;
  role_name: string; // 'customer', 'staff', 'admin'
  role_id: number;
  store_name: string | null;
  classification: 'new' | 'regular' | 'vip' | null;
  total_orders: number | null;
  total_spent: string | null;
  last_order_date: string | null;
  // Legacy fields for backward compatibility
  fullName?: string;
  phoneNumber?: string;
  role?: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  addresses?: IAddress[];
}

export interface IAccountResponse extends IBaseResponse<IAccount> {}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAccountsResponse {
  success: boolean;
  message: string;
  data: IAccount[];
  pagination: IPagination;
}

export interface IProfileResponse extends IBaseResponse<IAccount> {}

export interface IActionResponse extends IBaseResponse<{
  message: string;
}> {} 