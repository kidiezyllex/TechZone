import { IAddress } from "../request/account"

export interface IBaseResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface IAccountData {
  id: number
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  is_active: number
  is_verified: number
  store_id: number | null
  role: string
}

export interface IAuthData {
  account: IAccountData
  token: string
  refreshToken: string
}

export interface IAuthResponse extends IBaseResponse<IAuthData> {}

export interface IProfileData {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  role: string
  avatar: string
}

export interface IProfileResponse extends IBaseResponse<IProfileData> {}

