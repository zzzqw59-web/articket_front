import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/reservations";

export const getMyReservations = async (page = 1, size = 100) => {
  const response = await axiosInstance.get(`${BASE_URL}/me`, {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

// 예약 생성
export const createReservation = async (reservationData) => {
  const response = await axiosInstance.post(BASE_URL, reservationData);

  return response.data;
};

export const getReservationDetail = async (reservationId) => {
  const response = await axiosInstance.get(`${BASE_URL}/${reservationId}`);

  return response.data;
};

// 주문번호로 예약 상세 조회
export const getReservationByOrderId = async (orderId) => {
  const response = await axiosInstance.get(`${BASE_URL}/order/${orderId}`);

  return response.data;
};

export const getReservationList = async (page, size = 7, keyword = "") => {
  const response = await axiosInstance.get(`${BASE_URL}/list`, {
    params: { page, size, keyword },
  });
  return response;
};

export const cancelReservation = async (reservationId, cancelData) => {
  const response = await axiosInstance.patch(
    `${BASE_URL}/${reservationId}/cancel/admin`,
    {
      reason: cancelData.reason,
      detail: cancelData.detail,
    },
  );
  return response.data;
};
