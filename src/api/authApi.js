import axios from "axios";
import {
  clearAuth,
  getStoredAuthUser,
  getStoredRefreshToken,
  saveAuth,
  updateAccessToken,
} from "./authStorage";

const AUTH_BASE_URL = "/api/auth";

// 인증 API는 로그인 이전에도 사용하는 Public API이므로
// 일반 API용 axiosInstance와 분리해 사용한다.
// 이렇게 하면 로그인 실패나 Refresh 실패가 일반 401 인터셉터에 다시 걸리는 것을 막을 수 있다.
const authAxios = axios.create();

/**
 * 이메일 중복 확인
 * GET /api/auth/email/check?email=...
 */
export const checkEmail = async (email) => {
  const response = await authAxios.get(`${AUTH_BASE_URL}/email/check`, {
    params: { email },
  });

  return response.data;
};

/**
 * 회원가입
 * POST /api/auth/signup
 */
export const signup = async ({ email, password, nickname, name, phone }) => {
  await authAxios.post(`${AUTH_BASE_URL}/signup`, {
    email,
    password,
    nickname,
    name,
    phone,
  });
};

/**
 * 로그인
 * POST /api/auth/login
 *
 * 로그인 성공 시 이후 페이지에서 바로 사용할 수 있도록
 * Access Token / Refresh Token / 사용자 식별 정보를 localStorage에 저장한다.
 */
export const login = async ({ email, password }) => {
  const response = await authAxios.post(`${AUTH_BASE_URL}/login`, {
    email,
    password,
  });

  const {
    accessToken,
    refreshToken,
    memberId,
    memberType,
  } = response.data;

  saveAuth({
    accessToken,
    refreshToken,
    memberId,
    memberType,
  });

  return response.data;
};

/**
 * 로그아웃
 * POST /api/auth/logout
 *
 * 서버의 Refresh Token 삭제를 먼저 요청하고,
 * 요청 성공 여부와 관계없이 현재 브라우저의 로그인 정보도 제거한다.
 */
export const logout = async () => {
  const refreshToken = getStoredRefreshToken();

  try {
    if (refreshToken) {
      await authAxios.post(`${AUTH_BASE_URL}/logout`, {
        refreshToken,
      });
    }
  } finally {
    clearAuth();
  }
};

/**
 * Access Token 재발급
 * POST /api/auth/refresh
 *
 * axiosInstance의 401 처리에서 사용한다.
 */
export const refreshAccessToken = async () => {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    throw new Error("저장된 Refresh Token이 없습니다.");
  }

  const response = await authAxios.post(`${AUTH_BASE_URL}/refresh`, {
    refreshToken,
  });

  const newAccessToken = response.data?.accessToken;
  const newRefreshToken = response.data?.refreshToken;

  if (!newAccessToken) {
    throw new Error("Access Token 재발급에 실패했습니다.");
  }

  updateAccessToken(newAccessToken);

  if (newRefreshToken) {
    const user = getStoredAuthUser();

    saveAuth({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      memberId: user?.memberId,
      memberType: user?.memberType,
    });
  }

  return newAccessToken;
};

/**
 * 비밀번호 찾기 - 가입된 전화번호인지 확인
 * POST /api/auth/password/find
 */
export const findPassword = async (phone) => {
  const response = await authAxios.post(`${AUTH_BASE_URL}/password/find`, {
    phone,
  });

  return response.data;
};

/**
 * 비밀번호 재설정
 * PATCH /api/auth/password/reset
 */
export const resetPassword = async ({ phone, newPassword }) => {
  await authAxios.patch(`${AUTH_BASE_URL}/password/reset`, {
    phone,
    newPassword,
  });
};

/**
 * SMS 인증번호 발송
 * POST /api/auth/phone/send
 */
export const sendPhoneVerification = async ({ phone, type }) => {
  await authAxios.post(`${AUTH_BASE_URL}/phone/send`, {
    phone,
    type,
  });
};

/**
 * SMS 인증번호 확인
 * POST /api/auth/phone/verify
 */
export const verifyPhoneVerification = async ({ phone, code, type }) => {
  await authAxios.post(`${AUTH_BASE_URL}/phone/verify`, {
    phone,
    code,
    type,
  });
};