import axios from "axios";
import { refreshAccessToken } from "./authApi";
import {
  clearAuth,
  getStoredAccessToken,
  getStoredRefreshToken,
} from "./authStorage";

const axiosInstance = axios.create();

let refreshPromise = null;

const redirectToLogin = () => {
  if (window.location.pathname === "/articket/login") {
    return;
  }

  const currentPath = window.location.pathname + window.location.search;

  window.location.href = `/articket/login?redirect=${encodeURIComponent(
    currentPath
  )}`;
};

// Request Interceptor: 로그인 상태라면 모든 일반 API 요청에 Access Token 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getStoredAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
// 401: Access Token 만료 가능성이 있으므로 Refresh Token으로 한 번 재발급 후 원 요청 재시도
// 403: 인증은 되었지만 권한이 없는 상태일 수 있으므로 로그인 정보를 삭제하지 않음
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();

    // 로그인하지 않은 사용자의 Public API 요청에서 발생한 401까지
    // 강제로 로그인 페이지로 보내지 않는다.
    if (!accessToken && !refreshToken) {
      return Promise.reject(error);
    }

    // 같은 요청에서 Refresh를 반복하지 않도록 한 번만 시도한다.
    if (originalRequest._retry) {
      clearAuth();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (!refreshToken) {
      clearAuth();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // 여러 API가 동시에 401을 받더라도 Refresh 요청은 한 번만 실행한다.
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuth();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;