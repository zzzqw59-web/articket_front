// src/constants/config.js

// 회원 권한 타입 상수
export const MEMBER_ROLE = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
};

// 💡 저장소에서 토큰 및 사용자 정보 가져오기 헬퍼 함수
export const getStoredToken = () => localStorage.getItem("accessToken");

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};