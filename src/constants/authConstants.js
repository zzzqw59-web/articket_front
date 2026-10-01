// C:\articket\articket_front\src\constants\authConstants.js
import { MEMBER_ROLE } from "./config";

/**
 * 권한별 배지 UI 정보 매핑 (config.js의 MEMBER_ROLE 및 ROLE_ prefix 모두 지원)
 */
export const ROLE_BADGE_MAP = {
  // 기본 키 (ADMIN, STAFF, USER)
  [MEMBER_ROLE.ADMIN]: {
    label: "관리자",
    style: "bg-red-100 text-red-700 border-red-200",
  },
  [MEMBER_ROLE.STAFF]: {
    label: "전시 관계자",
    style: "bg-amber-100 text-amber-800 border-amber-200",
  },
  [MEMBER_ROLE.USER]: {
    label: "일반 회원",
    style: "bg-gray-100 text-gray-600 border-gray-200",
  },

  // Spring Security prefix 호환 (ROLE_ADMIN, ROLE_STAFF, ROLE_USER)
  [`ROLE_${MEMBER_ROLE.ADMIN}`]: {
    label: "관리자",
    style: "bg-red-100 text-red-700 border-red-200",
  },
  [`ROLE_${MEMBER_ROLE.STAFF}`]: {
    label: "전시 관계자",
    style: "bg-amber-100 text-amber-800 border-amber-200",
  },
  [`ROLE_${MEMBER_ROLE.USER}`]: {
    label: "일반 회원",
    style: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

/**
 * 인증, 회원가입 및 회원정보 관리 관련 상수 정의
 */
export const AUTH_CONSTANTS = {
  SMS_CODE_LENGTH: 6,        // SMS 인증번호 자릿수
  RESEND_TIMER_SECONDS: 180, // 인증번호 재발송 대기 시간 (3분)

  // 💡 회원 정보 수정 및 인증 관련 메시지
  MSG_ENTER_PASSWORD: "비밀번호를 입력해 주세요.",
  MSG_ENTER_AUTH_CODE: "인증번호 {length}자리를 입력해 주세요.",
  MSG_EXACT_AUTH_CODE: "인증번호 {length}자리를 정확히 입력해 주세요.",
  MSG_PHONE_VERIFIED_SUCCESS: "전화번호 인증이 완료되었습니다.",
  MSG_NEED_PHONE_VERIFY: "전화번호 인증을 완료해야만 회원 정보를 수정할 수 있습니다.",
  MSG_UPDATE_SUCCESS: "회원 정보가 성공적으로 수정되었습니다.",

  // 💡 회원 탈퇴 관련 상수 및 안내 문구
  WITHDRAWAL_CONFIRM_TITLE: "정말로 회원 탈퇴를 진행하시겠습니까?",
  WITHDRAWAL_WARNING_MESSAGE:
    "탈퇴 시 회원님의 기존 예약/결제 내역, 위시리스트, 작성 게시글 관리 권한 및 모든 혜택이 30일 후 삭제되며 복구할 수 없습니다.",
  WITHDRAWAL_CHECKBOX_LABEL: "위 안내 사항을 모두 확인하였으며, 동의합니다.",
  MSG_WITHDRAWAL_SUCCESS: "회원 탈퇴 처리가 완료되었습니다.",
};