import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../../hooks/useNotifications";

const NotificationBell = () => {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const bellRef = useRef(null);
  const location = useLocation();

  const token = localStorage.getItem("accessToken");

  const {
    notifications,
    unreadCount,
    refetch,
    handleRead,
    handleReadAll,
    handleDelete,
    handleDeleteAll,
  } = useNotifications();

  // 💡 페이지 이동 시 알림 동기화 (로그인 상태일 때만)
  useEffect(() => {
    if (token && refetch) {
      refetch();
    }
  }, [location.pathname, refetch, token]);

  // 외부 영역 클릭 처리 및 드롭다운 오픈 시 갱신
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsNotiOpen(false);
      }
    };
    if (isNotiOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (token && refetch) {
        refetch();
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotiOpen, refetch, token]);

  // 종 버튼 클릭 핸들러
  const handleBellClick = (e) => {
    e.stopPropagation();
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    setIsNotiOpen((prev) => !prev);
  };

  return (
    <div ref={bellRef} className="relative flex items-center">
      <button
        type="button"
        onClick={handleBellClick}
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

        {/* 💡 로그인 상태이고 읽지 않은 알림이 있을 때만 뱃지 표시 */}
        {token && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#ede6d6] shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 로그인 상태에서만 드롭다운 표시 */}
      {token && (
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
      )}
    </div>
  );
};

export default NotificationBell;