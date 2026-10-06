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