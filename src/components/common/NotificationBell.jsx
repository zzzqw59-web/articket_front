import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../../hooks/useNotifications";
import ConfirmModal from "./ConfirmModal";
import { useModal } from "../../hooks/useModal";

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

  // 👉 모달 상태 및 제어 함수는 최상단 Bell 컴포넌트에서 관리
  const { modalState, showAlert, showConfirm, closeModal, handleConfirm } = useModal();

  // 페이지 이동 시 알림 동기화
  useEffect(() => {
    if (token && refetch) {
      refetch();
    }
  }, [location.pathname, refetch, token]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalState.isOpen) return;

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
  }, [isNotiOpen, refetch, token, modalState.isOpen]);

  // 1. 비로그인 클릭 시 알림창 (showAlert)
  const handleBellClick = (e) => {
    e.stopPropagation();

    if (!token) {
      showAlert({
        title: "접근 제한",
        message: "로그인이 필요한 서비스입니다.",
        onConfirm: () => closeModal(),
      });
      return;
    }

    setIsNotiOpen((prev) => !prev);
  };

  // 2. 일괄 삭제 버튼 클릭 시 컨펌창 (showConfirm)
  const handleRequestDeleteAll = () => {
    if (notifications.length === 0) return;

    showConfirm({
      title: "알림 일괄 삭제",
      message: "모든 알림을 삭제하시겠습니까?\n삭제된 알림은 복구할 수 없습니다.",
      confirmLabel: "삭제",
      cancelLabel: "취소",
      onConfirm: () => {
        handleDeleteAll();
        closeModal();
      },
    });
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
        aria-label={unreadCount > 0 ? `알림 ${unreadCount}개 읽지 않음` : "알림"}
        aria-expanded={isNotiOpen}
        title="알림"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full text-[#48423B] transition-all duration-200 hover:bg-[#E7DFD3] hover:text-[#24211D]"
      >
        {/* 벨 아이콘 SVG 생략 (기존 코드 유지) */}
        <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {token && unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#A8483F] px-1 text-[10px] font-semibold text-white ring-2 ring-[#F3EEE4]">
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
          onDeleteAll={handleRequestDeleteAll} // 👉 일괄 삭제 트리거를 최상단 함수로 연결
        />
      )}

      {/* 👉 최상단(Bell) 레벨에서 모달 렌더링 (화면 정중앙 고정) */}
      <ConfirmModal
        modalState={modalState}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};

export default NotificationBell;