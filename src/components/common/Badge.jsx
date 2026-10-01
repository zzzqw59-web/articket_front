// src/components/common/Badge.jsx
import React from "react";
import { ROLE_BADGE_MAP } from "../../constants/authConstants";

// 전시 상태 전용 스타일 맵핑
const exhibitionStyles = {
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",   // 개최 전
  ongoing: "bg-emerald-100 text-emerald-700 border-emerald-200", // 개최 중
  ended: "bg-gray-200 text-gray-500 border-gray-300",       // 종료
};

const Badge = ({ label, variant = "USER", className = "" }) => {
  let displayLabel = label;
  let style = "";

  // 1. 권한(Role) 배지 처리 (ADMIN, USER, ROLE_ADMIN 등)
  if (ROLE_BADGE_MAP[variant]) {
    displayLabel = label || ROLE_BADGE_MAP[variant].label;
    style = ROLE_BADGE_MAP[variant].style;
  }
  // 2. 전시 상태 관련 배지 처리
  else if (exhibitionStyles[variant]) {
    style = exhibitionStyles[variant];
  }
  // 3. 기본값 (일반 회원 스타일)
  else {
    displayLabel = label || ROLE_BADGE_MAP.USER.label;
    style = ROLE_BADGE_MAP.USER.style;
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold border rounded-full whitespace-nowrap ${style} ${className}`}
    >
      {displayLabel}
    </span>
  );
};

export default Badge;