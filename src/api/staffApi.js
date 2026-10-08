import axios from "axios";

const prefix = "http://localhost:8080/api";

export const requestStaffAuthority = async (requestDTO) => {
  const response = await axios.post(`${prefix}/staff/requests`);
  return response.data;
};

export const getStaffExhibitions = async () => {
  const response = await axios.get(`${prefix}/staff/exhibitions`);
  return response.data;
};
