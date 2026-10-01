// src/components/common/Badge.jsx
import React from "react";

// 스타일 맵핑 (필요에 따라 색상 추가/수정 가능)
const variantStyles = {
  // 1. 권한 관련
  admin: "bg-red-100 text-red-700 border-red-200",         // 관리자
  staff: "bg-amber-100 text-amber-800 border-amber-200",   // 전시 관계자
  user: "bg-gray-100 text-gray-600 border-gray-200",       // 일반 회원

  // 2. 전시 상태 관련
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",    // 개최 전
  ongoing: "bg-emerald-100 text-emerald-700 border-emerald-200", // 개최 중
  ended: "bg-gray-200 text-gray-500 border-gray-300",       // 종료
};

const Badge = ({ label, variant = "user", className = "" }) => {
  const style = variantStyles[variant] || variantStyles.user;

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold border rounded-full whitespace-nowrap ${style} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;