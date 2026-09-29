import { useState, useEffect, useCallback } from "react"; // 보통 React 내장 훅 사용
import {
  getMyNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
} from "../api/notificationApi";

export const useNotifications = (memberId = 15) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. 알림 목록 및 안 읽은 개수 불러오기
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // 페이징 기본값 지정 (필요에 따라 page, size 조절 가능)
      const data = await getMyNotifications(1, 10, memberId);
      // 백엔드 PageResponseDTO 구조에 따라 dtoList 또는 content 추출 (프로젝트 구조에 맞춤)
      setNotifications(data.dtoList || data.content || []);
    } catch (error) {
      console.error("알림 목록을 불러오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  // 2. 안 읽은 알림 개수 갱신
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount(memberId);
      setUnreadCount(count);
    } catch (error) {
      console.error("안 읽은 알림 개수를 불러오는 데 실패했습니다.", error);
    }
  }, [memberId]);

  // 컴포넌트 마운트 시 데이터 동기화
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // 3. 단건 읽음 처리
  const handleRead = async (notificationId) => {
    try {
      await readNotification(notificationId, memberId);
      // 상태 즉시 반영 (낙관적 업데이트)
      setNotifications((prev) =>
        prev.map((item) =>
          item.notificationId === notificationId ? { ...item, isRead: true } : item
        )
      );
      fetchUnreadCount(); // 개수 동기화
    } catch (error) {
      console.error("알림 읽음 처리에 실패했습니다.", error);
    }
  };

  // 4. 전체 알림 일괄 읽음 처리
  const handleReadAll = async () => {
    try {
      await readAllNotifications(memberId);
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("전체 읽음 처리에 실패했습니다.", error);
    }
  };

  // 5. 단건 삭제
  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId, memberId);
      setNotifications((prev) => prev.filter((item) => item.notificationId !== notificationId));
      fetchUnreadCount(); // 개수 동기화
    } catch (error) {
      console.error("알림 삭제에 실패했습니다.", error);
    }
  };

  // 6. 전체 일괄 삭제
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications(memberId);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("전체 알림 삭제에 실패했습니다.", error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    refetch: fetchNotifications,
    handleRead,
    handleReadAll,
    handleDelete,
    handleDeleteAll,
  };
};