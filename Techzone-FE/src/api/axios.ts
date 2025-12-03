import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import cookies from 'js-cookie';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  shouldNotify?: boolean;
}

function getLocalAccessToken() {
  const accessToken = cookies.get('accessToken');
  return accessToken;
}

const instance = axios.create({
  timeout: 3 * 60 * 1000,
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('Request timeout or network error:', error.message);
      return Promise.reject(error);
    }
    
    const originalRequest = error.config as any;
    
    // Xử lý lỗi 401 (Unauthorized) - token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshTokenValue = localStorage.getItem('refreshToken');
      
      if (refreshTokenValue) {
        try {
          // Gọi API refresh token
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/refresh-token`,
            { refresh_token: refreshTokenValue }
          );
          
          if (refreshResponse.data?.success && refreshResponse.data?.data?.token) {
            const newToken = refreshResponse.data.data.token;
            cookies.set('accessToken', newToken, { expires: 7 });
            
            if (refreshResponse.data.data.refreshToken) {
              localStorage.setItem('refreshToken', refreshResponse.data.data.refreshToken);
            }
            
            // Retry request với token mới
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token thất bại, logout user
          logout();
          return Promise.reject(refreshError);
        }
      } else {
        // Không có refresh token, logout user
        logout();
      }
    }
    
    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error('403 Forbidden - Không có quyền truy cập');
      // Có thể hiển thị thông báo hoặc redirect
    }
    
    return Promise.reject(error);
  }
);

export function logout() {
  cookies.remove("accessToken");
  localStorage?.clear();
  const currentPath = location.pathname;
  if (currentPath !== "/auth/login" && !currentPath.includes("/checkout")) {
    window.location.replace("/auth/login");
  }
}

export const sendGet = async (url: string, params?: any): Promise<any> => {
  const response = await instance.get(url, { params });
  return response?.data;
};

export const sendPost = (url: string, params?: any, queryParams?: any) => {
  const config: AxiosRequestConfig = { params: queryParams };

  if (params instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }

  return instance.post(url, params, config).then((res) => res?.data);
};

export const sendPut = (url: string, params?: any) =>
  instance.put(url, params).then((res) => res?.data);

export const sendPatch = (url: string, params?: any) =>
  instance.patch(url, params).then((res) => res?.data);

export const sendDelete = (url: string, params?: any) =>
  instance.delete(url, { data: params }).then((res) => res?.data);

class ApiClient {
  get<T = any>(
    config: AxiosRequestConfig,
    options?: { shouldNotify: boolean }
  ): Promise<T> {
    return this.request({
      ...config,
      method: "GET",
      withCredentials: false,
      shouldNotify: options?.shouldNotify,
    });
  }

  post<T = any>(
    config: AxiosRequestConfig,
    options?: { shouldNotify: boolean }
  ): Promise<T> {
    return this.request({
      ...config,
      method: "POST",
      withCredentials: false,
      shouldNotify: options?.shouldNotify,
    });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PUT", withCredentials: false });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({
      ...config,
      method: "DELETE",
      withCredentials: false,
    });
  }

  patch<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PATCH", withCredentials: false });
  }

  private request<T = any>(config: CustomAxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      instance
        .request<any, AxiosResponse<any>>(config)
        .then((res: AxiosResponse<any>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}

export default new ApiClient();
