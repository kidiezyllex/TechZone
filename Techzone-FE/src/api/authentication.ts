// ===== Import các interface cho request (gửi lên server) ===== //
import {
  ISignIn,          // Interface cho đăng nhập
  IRegister         // Interface cho đăng ký
} from "@/interface/request/authentication";

// ===== Import các interface cho response (trả về từ server) ===== //
import {
  IAuthResponse,     // Kết quả trả về khi đăng nhập / đăng ký
  IProfileResponse   // Kết quả trả về khi lấy thông tin người dùng
} from "@/interface/response/authentication";

// ===== Import các hàm gọi HTTP đã xây dựng ===== //
import { sendGet, sendPost } from "./axios";

// ======= AUTH API ======= //

/**
 * Gửi OTP để đăng ký tài khoản mới
 * @param email - Email để đăng ký
 * @returns Message xác nhận OTP đã được gửi
 */
export const requestRegisterOTP = async (email: string): Promise<any> => {
  const res = await sendPost("auth/request-register-otp", { email });
  return res;
};

/**
 * Đăng ký tài khoản mới với OTP verification
 * @param payload - Dữ liệu đăng ký tài khoản (email, password, otp, v.v.)
 * @returns Dữ liệu xác thực chứa token và thông tin người dùng
 */
export const register = async (payload: any): Promise<IAuthResponse> => {
  const res = await sendPost("auth/register", payload);
  return res as IAuthResponse;
};

/**
 * Đăng nhập hệ thống
 * @param payload - Dữ liệu đăng nhập (email và password)
 * @returns Dữ liệu xác thực chứa token và thông tin người dùng
 */
export const login = async (payload: ISignIn): Promise<IAuthResponse> => {
  const res = await sendPost("auth/login", payload);
  return res as IAuthResponse;
};

/**
 * Lấy thông tin người dùng hiện tại (dựa vào access token)
 * @returns Thông tin hồ sơ người dùng hiện tại
 */
export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet("auth/profile");
  return res as IProfileResponse;
};

/**
 * Cập nhật thông tin người dùng
 * @param payload - Dữ liệu cập nhật (full_name, phone, v.v.)
 * @returns Thông tin người dùng đã cập nhật
 */
export const updateProfile = async (payload: any): Promise<IProfileResponse> => {
  const res = await sendPost("auth/profile", payload);
  return res as IProfileResponse;
};

/**
 * Đổi mật khẩu
 * @param payload - Dữ liệu chứa mật khẩu cũ và mật khẩu mới
 * @returns Message xác nhận đổi mật khẩu thành công
 */
export const changePassword = async (payload: any): Promise<any> => {
  const res = await sendPost("auth/change-password", payload);
  return res;
};

/**
 * Gửi OTP để đặt lại mật khẩu
 * @param email - Email để reset password
 * @returns Message xác nhận OTP đã được gửi
 */
export const requestPasswordReset = async (email: string): Promise<any> => {
  const res = await sendPost("auth/request-password-reset", { email });
  return res;
};

/**
 * Đặt lại mật khẩu với OTP verification
 * @param payload - Dữ liệu chứa email, OTP, và mật khẩu mới
 * @returns Message xác nhận reset password thành công
 */
export const resetPassword = async (payload: any): Promise<any> => {
  const res = await sendPost("auth/reset-password", payload);
  return res;
};

/**
 * Làm mới token khi hết hạn access token
 * @param payload - Dữ liệu chứa refreshToken hiện tại
 * @returns Cặp token mới (access token và refresh token)
 */
export const refreshToken = async (
  payload: { refresh_token: string }
): Promise<{ success: boolean; data: { token: string; refreshToken: string } }> => {
  const res = await sendPost("auth/refresh-token", payload);
  return res;
};
