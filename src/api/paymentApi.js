import axiosInstance from "./axiosInstance";

const BASE_URL = "http://localhost:8080/api/payments";

export const confirmPayment = async (paymentData) => {
  const response = await axiosInstance.post(
    `${BASE_URL}/confirm`,
    paymentData
  );

  return response.data;
};