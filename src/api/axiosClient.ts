// src/api/axiosClient.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { AuthEndpoints } from "../api/api";

// baseURL = VITE_API_URL + VITE_API_BASE para endpoints privados
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE || ""}`,
  timeout: 5000,
  withCredentials: true,
});

// -------------------- Request Interceptor --------------------
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

// -------------------- Response Interceptor (Refresh Token) --------------------
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes(AuthEndpoints.refresh)
    ) {
      originalRequest._retry = true;

      try {
        const res = await axiosClient.post(AuthEndpoints.refresh);
        const newAccessToken = res.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);

          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }

          originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
