import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/notifications";

// NOTI-001: 내 알림 목록 조회 (페이징)
export const getMyNotifications = async (page = 1, size = 10) => {
  const response = await axiosInstance.get(BASE_URL, {
    params: { page, size },
  });
  return response.data;
};

// NOTI-002: 단건 알림 읽음 처리
export const readNotification = async (notificationId) => {
  const response = await axiosInstance.patch(`${BASE_URL}/${notificationId}/read`);
  return response.data;
};

// NOTI-003: 전체 알림 일괄 읽음 처리
export const readAllNotifications = async () => {
  const response = await axiosInstance.patch(`${BASE_URL}/read-all`);
  return response.data;
};

// NOTI-004: 단건 알림 삭제
export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${notificationId}`);
  return response.data;
};

// NOTI-005: 전체 알림 일괄 삭제
export const deleteAllNotifications = async () => {
  const response = await axiosInstance.delete(BASE_URL);
  return response.data;
};

// NOTI-006: 안 읽은 알림 목록 조회
export const getUnreadNotifications = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/unread`);
  return response.data;
};

// NOTI-007: 안 읽은 알림 개수 조회 (배지/N 표시용)
export const getUnreadCount = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/unread/count`);
  return response.data;
};