import { useState, useEffect, useCallback } from "react";
import {
  getMyNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
} from "../api/notificationApi";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 💡 로그인 여부 판단 (토큰 유무 기준)
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // 1. 알림 목록 불러오기 (비로그인 시 실행 안 함)
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      setLoading(true);
      const data = await getMyNotifications(1, 10);
      setNotifications(data.dtoList || data.content || []);
    } catch (error) {
      console.error("알림 목록을 불러오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 2. 안 읽은 알림 개수 갱신 (비로그인 시 실행 안 함)
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("안 읽은 알림 개수를 불러오는 데 실패했습니다.", error);
    }
  }, [isAuthenticated]);

  // 목록과 뱃지 개수 동시에 갱신
  const refetchAll = useCallback(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  // 컴포넌트 마운트 및 로그인 상태 변화 시 데이터 동기화
  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  // 3. 단건 읽음 처리
  const handleRead = async (notificationId) => {
    if (!isAuthenticated) return;

    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;

    try {
      await readNotification(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item.notificationId === notificationId ? { ...item, notificationIsRead: 1 } : item
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error("알림 읽음 처리에 실패했습니다.", error);
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
    }
  };

  // 4. 전체 알림 일괄 읽음 처리
  const handleReadAll = async () => {
    if (!isAuthenticated) return;
    try {
      await readAllNotifications();
      setNotifications((prev) => prev.map((item) => ({ ...item, notificationIsRead: 1 })));
      setUnreadCount(0);
    } catch (error) {
      console.error("전체 읽음 처리에 실패했습니다.", error);
    }
  };

  // 5. 단건 삭제
  const handleDelete = async (notificationId) => {
    if (!isAuthenticated) return;
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((item) => item.notificationId !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error("알림 삭제에 실패했습니다.", error);
    }
  };

  // 6. 전체 일괄 삭제
  const handleDeleteAll = async () => {
    if (!isAuthenticated) return;
    try {
      await deleteAllNotifications();
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
    refetch: refetchAll,
    handleRead,
    handleReadAll,
    handleDelete,
    handleDeleteAll,
  };
};