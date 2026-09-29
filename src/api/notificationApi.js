import axios from "axios";

// 임시 회원 ID (추후 인증 정보 연동 시 변경 가능)
const TEMP_MEMBER_ID = 15;

// NOTI-001: 내 알림 목록 조회 (페이징)
export const getMyNotifications = async (page = 1, size = 10, memberId = TEMP_MEMBER_ID) => {
  const response = await axios.get("/api/notifications", {
    params: { memberId, page, size },
  });
  return response.data;
};

// NOTI-002: 단건 알림 읽음 처리
export const readNotification = async (notificationId, memberId = TEMP_MEMBER_ID) => {
  const response = await axios.patch(`/api/notifications/${notificationId}/read`, null, {
    params: { memberId },
  });
  return response.data;
};

// NOTI-003: 전체 알림 일괄 읽음 처리
export const readAllNotifications = async (memberId = TEMP_MEMBER_ID) => {
  const response = await axios.patch("/api/notifications/read-all", null, {
    params: { memberId },
  });
  return response.data;
};

// NOTI-004: 단건 알림 삭제
export const deleteNotification = async (notificationId, memberId = TEMP_MEMBER_ID) => {
  const response = await axios.delete(`/api/notifications/${notificationId}`, {
    params: { memberId },
  });
  return response.data;
};

// NOTI-005: 전체 알림 일괄 삭제
export const deleteAllNotifications = async (memberId = TEMP_MEMBER_ID) => {
  const response = await axios.delete("/api/notifications", {
    params: { memberId },
  });
  return response.data;
};

// NOTI-006: 안 읽은 알림 목록 조회
export const getUnreadNotifications = async (memberId = TEMP_MEMBER_ID) => {
  const response = await axios.get("/api/notifications/unread", {
    params: { memberId },
  });
  return response.data;
};

// NOTI-007: 안 읽은 알림 개수 조회 (배지/N 표시용)
export const getUnreadCount = async (memberId = TEMP_MEMBER_ID) => {
  const response = await axios.get("/api/notifications/unread/count", {
    params: { memberId },
  });
  return response.data;
};