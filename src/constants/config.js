// src/constants/config.js

// 회원 권한 타입 상수
export const MEMBER_ROLE = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
};

// 🚀 추후 JWT 인증 연동 시, 로그인한 사용자 정보로 대체될 전역 객체
export const CURRENT_USER = {
  memberId: 2, // 테스트용 내 회원 ID
  memberType: MEMBER_ROLE.USER, // 테스트용 내 권한 (관리자 또는 일반회원 등)
};
// 💡 저장소에서 토큰 및 사용자 정보 가져오기 헬퍼 함수
export const getStoredToken = () => localStorage.getItem("accessToken");

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
