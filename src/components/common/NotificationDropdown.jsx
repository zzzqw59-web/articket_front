import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

// [추가] ISO 날짜 문자열을 상대 시간(방금 전, N분 전, N시간 전 등)으로 변환하는 헬퍼 함수
const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "방금 전";

  const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

  if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute"); // N분 전
  }
  if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour"); // N시간 전
  }
  if (diffInSeconds < 604800) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day"); // N일 전
  }

  // 일주일 이상 지난 오래된 알림은 YYYY.MM.DD 형태로 표출
  return past.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // 필터 탭 상태: 'all' (모든 알림) | 'unread' (안 읽은 알림)
  const [filter, setFilter] = useState("all");

  // 샘플 알림 데이터 (실제 백엔드 API에서 제공할 ISO timestamp 날짜 형식으로 변경)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "내 문의에 새 댓글이 등록되었습니다.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 30).toISOString(), // 30초 전 (방금 전)
      targetUrl: "/articket/ask",
    },
    {
      id: 2,
      text: "예약하신 [반 고흐 미디어아트전] 취소가 완료되었습니다.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10분 전
      targetUrl: "/articket/mypage",
    },
    {
      id: 3,
      text: "내 작성글에 새 댓글이 등록되었습니다.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
      targetUrl: "/articket/mypage",
    },
    {
      id: 4,
      text: "문의 내역 답변이 완료되었습니다.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전 (어제)
      targetUrl: "/articket/ask",
    },
  ]);

  // 외부 영역 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter((item) =>
    filter === "unread" ? !item.isRead : true
  );

  // 개별 알림 삭제
  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // 알림 클릭 핸들러: 읽음 처리 후 해당 URL로 이동
  const handleItemClick = (item) => {
    // 1. 읽음 처리
    setNotifications((prev) =>
      prev.map((noti) => (noti.id === item.id ? { ...noti, isRead: true } : noti))
    );

    // 2. 드롭다운 팝업 닫기
    onClose();

    // 3. 해당 URL 경로로 이동
    if (item.targetUrl) {
      navigate(item.targetUrl);
    }
  };

  // 하단 1: 모두 읽음 처리
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  // 하단 2: 일괄 삭제
  const handleClearAll = () => {
    if (window.confirm("모든 알림을 삭제하시겠습니까?")) {
      setNotifications([]);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-16 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden text-xs"
    >
      {/* 1. 상단 필터 탭 (모든 알림 / 안 읽은 알림) */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`flex-1 py-2.5 font-medium transition-colors border-b-2 ${
            filter === "all"
              ? "border-amber-600 text-amber-700 bg-white font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          모든 알림
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`flex-1 py-2.5 font-medium transition-colors border-b-2 ${
            filter === "unread"
              ? "border-amber-600 text-amber-700 bg-white font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          안 읽은 알림 ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* 2. 알림 목록 영역 */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`p-3 flex items-center justify-between gap-2 hover:bg-amber-50/60 transition-colors cursor-pointer ${
                !item.isRead ? "bg-amber-50/30 font-medium" : "bg-white text-gray-600"
              }`}
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                {/* 안 읽은 알림 붉은 점 표시 */}
                {!item.isRead && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="truncate text-gray-800">{item.text}</span>
                  {/* [변경] formatRelativeTime 함수로 ISO 생성 시각 변환 표출 */}
                  <span className="text-[10px] text-gray-400">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
              </div>

              {/* 개별 X 삭제 버튼 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 이벤트 전파 차단
                  handleDelete(item.id);
                }}
                className="text-gray-300 hover:text-gray-600 p-1 shrink-0"
                title="삭제"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-400 text-xs">
            알림이 없습니다.
          </div>
        )}
      </div>

      {/* 3. 하단 액션 버튼 영역 (모두 읽음 / 일괄 삭제) */}
      <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-t border-gray-100">
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          className="text-gray-500 hover:text-amber-600 font-medium transition-colors text-[11px]"
        >
          모두 읽음
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-gray-400 hover:text-red-500 transition-colors text-[11px]"
        >
          일괄 삭제
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;