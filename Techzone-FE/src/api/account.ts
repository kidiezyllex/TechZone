import {
  IAccountFilter,
  IAccountCreate,
  IAccountUpdate,
  IAccountStatusUpdate,
  IAddressCreate,
  IAddressUpdate,
  IProfileUpdate,
  IChangePassword,
} from "@/interface/request/account";

import {
  IAccountsResponse,
  IAccountResponse,
  IProfileResponse,
  IActionResponse
} from "@/interface/response/account";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const getAllAccounts = async (params: IAccountFilter): Promise<IAccountsResponse> => {
  const res = await sendGet("/users", params);
  return res as IAccountsResponse;
};

export const getAccountById = async (accountId: string): Promise<IAccountResponse> => {
  const res = await sendGet(`/users/${accountId}`);
  return res as IAccountResponse;
};

export const createAccount = async (payload: IAccountCreate): Promise<IAccountResponse> => {
  const res = await sendPost("/users/register", payload);
  return res as IAccountResponse;
};

export const updateAccount = async (accountId: string, payload: IAccountUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/users/${accountId}`, payload);
  return res as IAccountResponse;
};

export const updateAccountStatus = async (accountId: string, payload: IAccountStatusUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/users/${accountId}/status`, payload);
  return res as IAccountResponse;
};

export const deleteAccount = async (accountId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/users/${accountId}`);
  return res as IActionResponse;
};

export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/users/profile");
  return res as IProfileResponse;
};

export const updateProfile = async (payload: IProfileUpdate): Promise<IProfileResponse> => {
  const res = await sendPut("/users/profile", payload);
  return res as IProfileResponse;
};

export const changePassword = async (payload: IChangePassword): Promise<IActionResponse> => {
  const res = await sendPut("/users/profile/password", payload);
  return res as IActionResponse;
};

export const addAddress = async (payload: IAddressCreate): Promise<IProfileResponse> => {
  const res = await sendPost("/users/profile/addresses", payload);
  return res as IProfileResponse;
};

export const updateAddress = async (addressId: string, payload: IAddressUpdate): Promise<IProfileResponse> => {
  const res = await sendPut(`/users/profile/addresses/${addressId}`, payload);
  return res as IProfileResponse;
};

export const deleteAddress = async (addressId: string): Promise<IProfileResponse> => {
  const res = await sendDelete(`/users/profile/addresses/${addressId}`);
  return res as IProfileResponse;
};
