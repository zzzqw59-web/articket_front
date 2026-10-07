// src/components/common/Badge.jsx
import { ROLE_BADGE_MAP } from "../../constants/authConstants";

// 전시 상태 전용 스타일 맵핑
const exhibitionStyles = {
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",   // 개최 전
  ongoing: "bg-emerald-100 text-emerald-700 border-emerald-200", // 개최 중
  ended: "bg-gray-200 text-gray-500 border-gray-300",       // 종료
};

const Badge = ({ label, variant = "MEMBER", className = "" }) => {
  let displayLabel = label;
  let style = "";

  // 💡 'ROLE_MEMBER' 형태로 들어올 경우 대비하여 'MEMBER' 형태로 정형화
  const normalizedVariant = String(variant || "MEMBER")
    .replace("ROLE_", "")
    .toUpperCase();

  // 1. 권한(Role) 배지 처리 (ADMIN, STAFF, MEMBER 등)
  if (ROLE_BADGE_MAP[normalizedVariant]) {
    displayLabel = label || ROLE_BADGE_MAP[normalizedVariant].label;
    style = ROLE_BADGE_MAP[normalizedVariant].style;
  }
  // 2. 전시 상태 관련 배지 처리 (upcoming, ongoing, ended 등)
  else if (exhibitionStyles[variant]) {
    style = exhibitionStyles[variant];
  }
  // 3. 기본값 (일반 회원 MEMBER 스타일)
  else {
    const defaultRole = ROLE_BADGE_MAP.MEMBER || { label: "일반회원", style: "bg-gray-100 text-gray-700 border-gray-200" };
    displayLabel = label || defaultRole.label;
    style = defaultRole.style;
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