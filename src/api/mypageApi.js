import axiosInstance from "./axiosInstance";

// 💡 문의글 관련 기본 URL
const ASK_BASE_URL = "/api/asks";
// 💡 회원 관련 기본 URL
const MEMBER_BASE_URL = "/api/members";
// 💡 리뷰 관련 기본 URL
const REVIEW_BASE_URL = "/api/reviews";
// 💡 마이페이지 관련 기본 URL
const MYPAGE_BASE_URL = "/api/mypage";


// MEMBER-001: 회원 정보 조회
export const getMyProfile = async () => {
  const response = await axiosInstance.get(`${MEMBER_BASE_URL}/me`);
  return response.data; // MemberResponseDTO
};

// MEMBER-002: 회원 정보 수정
export const updateMyProfile = async (updateData) => {
  // updateData: { nickname, password, phone }
  const response = await axiosInstance.patch(`${MEMBER_BASE_URL}/me`, updateData);
  return response.data;
};

// MEMBER-008: 비밀번호 재확인
export const checkMyPassword = async (password) => {
  const response = await axiosInstance.post(`${MEMBER_BASE_URL}/me/password/check`, {
    password,
  });
  return response.data; // boolean (matches)
};

// ASK-006: 내 문의글 목록 조회
export const getMyAskList = async (page = 1, size = 10, searchType = "", keyword = "") => {
  const response = await axiosInstance.get(`${ASK_BASE_URL}/my`, {
    params: { page, size, searchType, keyword },
  });
  return response.data; // PageResponseDTO<AskListResponseDTO>
};

// REV-010: 내 리뷰 목록 조회
export const getMyReviewList = async (page = 1, size = 10, searchType = "", keyword = "") => {
  const response = await axiosInstance.get(`${REVIEW_BASE_URL}/me`, {
    params: { page, size, searchType, keyword },
  });
  return response.data; // PageResponseDTO<MyReviewListResponseDTO>
};

// MYPOST-001: 내 댓글 목록 조회
export const getMyReplyList = async (page = 1, size = 10, searchType = "", keyword = "") => {
  const response = await axiosInstance.get(`${MYPAGE_BASE_URL}/replies`, {
    params: { page, size, searchType, keyword },
  });
  return response.data; // PageResponseDTO<MyReplyListResponseDTO>
};