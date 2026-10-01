import axios from "axios";

const axiosInstance = axios.create();

// Request Interceptor: 모든 요청에 토큰 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 💡 Response Interceptor: 401(인증 실패), 403(권한 없음) 에러 중앙 집중 처리
// src/api/axiosInstance.js (응답 인터셉터 부분)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      alert("접근 권한이 없거나 로그인 세션이 만료되었습니다.\n로그인 페이지로 이동합니다.");

      const currentPath = window.location.pathname + window.location.search;
      
      if (window.location.pathname !== "/articket/login") {
        // 💡 redirect 쿼리 파라미터로 원래 접속하려던 경로를 전달
        window.location.href = `/articket/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;