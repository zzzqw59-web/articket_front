// src/constants/config.js

// 회원 권한 타입 상수
export const MEMBER_ROLE = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
};

// 🚀 추후 JWT 인증 연동 시, 로그인한 사용자 정보로 대체될 전역 객체
export const CURRENT_USER = {
  memberId: 15, // 테스트용 내 회원 ID
  memberType: MEMBER_ROLE.ADMIN, // 테스트용 내 권한 (관리자 또는 일반회원 등)
};

// 기존 하위 호환을 위한 내보내기 (필요시 유지)
export const TEMP_MEMBER_ID = CURRENT_USER.memberId;
