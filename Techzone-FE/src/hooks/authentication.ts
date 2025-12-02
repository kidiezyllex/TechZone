import {
  login,
  logout,
  getCurrentUser,
  refreshToken
} from "@/api/authentication";
import type {
  ISignIn,
} from "@/interface/request/authentication";
import type {
  IAuthResponse,
  IProfileResponse
} from "@/interface/response/authentication";
import {
  type UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import cookies from "js-cookie";
import { useChangePassword, useUpdateUserProfile } from './account';
import { toastService } from '@/services/toast.service';

export const useLogin = (): UseMutationResult<
  IAuthResponse,
  Error,
  ISignIn
> => {
  return useMutation<IAuthResponse, Error, ISignIn>({
    mutationFn: (params: ISignIn) => login(params),
    onSuccess: (result: IAuthResponse) => {
      if (result.success && result.data?.token) {
        cookies.set("accessToken", result.data.token, { expires: 7 }); // 7 ngày
        if (result.data.refreshToken) {
          localStorage.setItem("refreshToken", result.data.refreshToken);
        }
        toastService.success(result.message || 'Đăng nhập thành công')
      }
      return result;
    },
    onError: (error: any) => {
      toastService.error(error?.response?.data?.message || 'Đăng nhập thất bại')
    }
  });
};

export const useLogout = (): UseMutationResult<
  {success: boolean; message: string},
  Error,
  void
> => {
  return useMutation<{success: boolean; message: string}, Error, void>({
    mutationFn: () => logout(),
    onSuccess: (result) => {
      cookies.remove("accessToken");
      localStorage.clear();
      toastService.success('Đã đăng xuất')
    },
    onError: (error: any) => {
      toastService.error(error?.response?.data?.message || 'Đăng xuất thất bại')
    }
  });
};

export const useCurrentUser = () => {
  const {
    data: userData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<IProfileResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    enabled: typeof window !== 'undefined' && (!!cookies.get("accessToken")),
  });

  return {
    userData,
    isLoading,
    isFetching,
    refetch,
  };
};

export const useRefreshToken = (): UseMutationResult<
  {success: boolean; data: {token: string; refreshToken: string}},
  Error,
  {refreshToken: string}
> => {
  return useMutation<
    {success: boolean; data: {token: string; refreshToken: string}},
    Error,
    {refreshToken: string}
  >({
    mutationFn: (params: {refreshToken: string}) => refreshToken({ refresh_token: params.refreshToken }),
    onSuccess: (result) => {
      if (result.success && result.data.token) {
        cookies.set("accessToken", result.data.token, { expires: 7 });
        if (result.data.refreshToken) {
          localStorage.setItem("refreshToken", result.data.refreshToken);
        }
      }
      return result;
    },
  });
};

export { useChangePassword, useUpdateUserProfile as useUpdateProfile };
