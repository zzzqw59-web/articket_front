
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

  // 페이지 이동 시 알림 동기화
  useEffect(() => {
    if (token && refetch) {
      refetch();
    }
  }, [location.pathname, refetch, token]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setIsNotiOpen(false);
      }
    };

    if (isNotiOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );

      if (token && refetch) {
        refetch();
      }
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isNotiOpen, refetch, token]);

  // 알림 버튼 클릭
  const handleBellClick = (e) => {
    e.stopPropagation();

    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    setIsNotiOpen((prev) => !prev);
  };

  return (
    <div
      ref={bellRef}
      className="relative flex shrink-0 items-center justify-center"
    >
      {/* 알림 버튼 */}
      <button
        type="button"
        onClick={handleBellClick}
        aria-label={
          unreadCount > 0
            ? `알림 ${unreadCount}개 읽지 않음`
            : "알림"
        }
        aria-expanded={isNotiOpen}
        title="알림"
        className="
          group relative
          flex h-10 w-10
          items-center justify-center
          rounded-full
          text-[#48423B]
          transition-all duration-200
          hover:bg-[#E7DFD3]
          hover:text-[#24211D]
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#514B44]
        "
      >
        {/* 벨 아이콘 */}
        <svg
          className="
            h-[22px] w-[22px]
            transition-transform duration-200
            group-hover:rotate-[-8deg]
          "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="
              M15 17h5
              l-1.405-1.405
              A2.032 2.032 0 0118 14.158
              V11
              a6.002 6.002 0 00-4-5.659
              V5
              a2 2 0 10-4 0
              v.341
              C7.67 6.165 6 8.388 6 11
              v3.159
              c0 .538-.214 1.055-.595 1.436
              L4 17h5
              m6 0v1
              a3 3 0 11-6 0
              v-1
              m6 0H9
            "
          />
        </svg>

        {/* 읽지 않은 알림 수 */}
        {token && unreadCount > 0 && (
          <span
            className="
              absolute -right-1 -top-1
              flex h-[18px] min-w-[18px]
              items-center justify-center
              rounded-full
              bg-[#A8483F]
              px-1
              text-[10px] font-semibold
              leading-none text-white
              ring-2 ring-[#F3EEE4]
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 드롭다운 */}
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
