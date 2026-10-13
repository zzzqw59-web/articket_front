import axios from "axios";
import axiosInstance from "./axiosInstance";

const prefix = "http://localhost:8080/api";

export const requestStaffAuthority = async (requestDTO) => {
  const response = await axios.post(`${prefix}/staff/requests`, requestDTO);
  return response.data;
};

export const getStaffExhibitions = async () => {
  const response = await axios.get(`${prefix}/staff/exhibitions`);
  return response.data;
};

export const getStaffRequest = async () => {
  const response = await axiosInstance.get(`${prefix}/staff/requests`);
  return response.data;
};
