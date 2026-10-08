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
  const response = await axiosInstance.post(
    BASE_URL,
    reservationData
  );

  return response.data;
};

export const getReservationDetail = async (reservationId) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/reservations/${reservationId}`
  );

  return response.data;
};

// 주문번호로 예약 상세 조회
export const getReservationByOrderId = async (orderId) => {
  const response = await axiosInstance.get(
    `${BASE_URL}/order/${orderId}`
  );

  return response.data;
};
