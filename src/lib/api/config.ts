import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { ApiResponse } from "@/types";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getFirebaseIdToken } from "@/lib/firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getFirebaseIdToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers.Authorization) {
      delete config.headers.Authorization;
    }

    const storeLang = useUIStore.getState().language;
    const browserLang =
      typeof navigator !== "undefined"
        ? navigator.language || (navigator.languages && navigator.languages[0])
        : undefined;
    const acceptLanguage = storeLang || browserLang || "en";

    config.headers["Accept-Language"] = acceptLanguage;

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.get<ApiResponse<T>>(url, config).then((res) => res.data),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data),

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.delete<ApiResponse<T>>(url, config).then((res) => res.data),
};

export default apiClient;
