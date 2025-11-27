import {
  ISignIn,
  IRegister
} from "@/interface/request/authentication";

import {
  IAuthResponse,
  IProfileResponse
} from "@/interface/response/authentication";

import { sendGet, sendPost } from "./axios";

export const requestRegisterOTP = async (email: string): Promise<any> => {
  const res = await sendPost("auth/request-register-otp", { email });
  return res;
};

export const register = async (payload: any): Promise<IAuthResponse> => {
  const res = await sendPost("auth/register", payload);
  return res as IAuthResponse;
};

export const login = async (payload: ISignIn): Promise<IAuthResponse> => {
  const res = await sendPost("auth/login", payload);
  return res as IAuthResponse;
};

export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet("auth/profile");
  return res as IProfileResponse;
};

export const updateProfile = async (payload: any): Promise<IProfileResponse> => {
  const res = await sendPost("auth/profile", payload);
  return res as IProfileResponse;
};

export const changePassword = async (payload: any): Promise<any> => {
  const res = await sendPost("auth/change-password", payload);
  return res;
};

export const requestPasswordReset = async (email: string): Promise<any> => {
  const res = await sendPost("auth/request-password-reset", { email });
  return res;
};

export const resetPassword = async (payload: any): Promise<any> => {
  const res = await sendPost("auth/reset-password", payload);
  return res;
};

export const refreshToken = async (
  payload: { refresh_token: string }
): Promise<{ success: boolean; data: { token: string; refreshToken: string } }> => {
  const res = await sendPost("auth/refresh-token", payload);
  return res;
};

export const logout = async (): Promise<{ success: boolean; message: string }> => {
  const res = await sendPost("auth/logout");
  return res;
};

export const getCurrentUser = async (): Promise<IProfileResponse> => {
  return getProfile();
};
