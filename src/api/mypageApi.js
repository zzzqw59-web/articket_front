import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/asks";

// 1. 내 문의글 목록 조회
export const getMyAskList = async (page = 1, size = 10, searchType = "", keyword = "") => {
  const response = await axiosInstance.get(`${BASE_URL}/my`, {
    params: { page, size, searchType, keyword },
  });
  return response.data; // PageResponseDTO<AskListResponseDTO>
};