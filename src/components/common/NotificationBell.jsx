import React, { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // 안 읽은 알림 개수 (API 연동용)
  const bellRef = useRef(null);

  // 외부 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsNotiOpen(false);
      }
    };
    if (isNotiOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotiOpen]);

  return (
    <div ref={bellRef} className="relative flex items-center">
      {/* 종 아이콘 버튼 (Header 원형 버튼 스타일과 통일) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Header 상단 스크롤 이벤트 클릭 간섭 방지
          setIsNotiOpen((prev) => !prev);
        }}
        className="relative w-15 h-15 border-2 border-[#0b2342] rounded-full select-none cursor-pointer 
        flex items-center justify-center hover:bg-[#0b2342] hover:text-white transition-colors duration-300 text-[#0b2342]"
        title="알림"
      >
        {/* 종 SVG 아이콘 */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* 읽지 않은 알림 뱃지 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#ede6d6] shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 드롭다운 팝업 목록 */}
      <NotificationDropdown
        isOpen={isNotiOpen}
        onClose={() => setIsNotiOpen(false)}
      />
    </div>
  );
};

export default NotificationBell;