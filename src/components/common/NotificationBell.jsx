import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../../hooks/useNotifications"; // 커스텀 훅 경로에 맞게 수정
import { CURRENT_USER } from "../../constants/config"; // 임시 회원 ID constants/config.js에서 가져오기

const NotificationBell = () => {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const bellRef = useRef(null);
  const location = useLocation(); // 👈 현재 경로 추적

  // 커스텀 훅을 통해 알림 데이터 및 액션 함수들 가져오기
  const {
    notifications,
    unreadCount,
    refetch,
    handleRead,
    handleReadAll,
    handleDelete,
    handleDeleteAll,
    
  } = useNotifications(CURRENT_USER.memberId); 

  // 💡 1. 페이지가 이동할 때마다 알림 데이터 자동 갱신
  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [location.pathname, refetch]);

  // 외부 영역 클릭 시 드롭다운 닫기 및 드롭다운을 열 때 최신화
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsNotiOpen(false);
      }
    };
    if (isNotiOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // 💡 2. 알림 종을 클릭해서 열 때마다 즉시 최신 알림 및 개수 동기화
      if (refetch) {
        refetch();
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotiOpen, refetch]);

  return (
    <div ref={bellRef} className="relative flex items-center">
      {/* 종 아이콘 버튼 */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsNotiOpen((prev) => !prev);
        }}
        className="relative w-15 h-15 border-2 border-[#0b2342] rounded-full select-none cursor-pointer 
        flex items-center justify-center hover:bg-[#0b2342] hover:text-white transition-colors duration-300 text-[#0b2342]"
        title="알림"
      >
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

      {/* 알림 드롭다운 팝업 목록 (훅에서 가져온 데이터 및 핸들러 전달) */}
      <NotificationDropdown
        isOpen={isNotiOpen}
        onClose={() => setIsNotiOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onRead={handleRead}
        onReadAll={handleReadAll}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
};

export default NotificationBell;