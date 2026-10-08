import axiosInstance from "./axiosInstance";

const MEMBER_BASE_URL = "/api/members";

/**
 * 로그인한 회원의 정보 조회
 * GET /api/members/me
 */
export const getMyMember = async () => {
  const response = await axiosInstance.get(`${MEMBER_BASE_URL}/me`);
  return response.data;
};