import axiosInstance from "./axiosInstance";

// 💡 문의글 관련 기본 URL
const ASK_BASE_URL = "/api/asks";
// 💡 회원 정보 관련 기본 URL
const MEMBER_BASE_URL = "/api/members/me";
// 💡 리뷰 관련 기본 URL
const REVIEW_BASE_URL = "/api/reviews";
// 💡 기타 마이페이지 관련 기본 URL
const MYPAGE_BASE_URL = "/api/mypage";
// 💡 예약 관련 기본 URL
const RESERVATION_BASE_URL = "/api/reservations";


// MEMBER-001: 회원 정보 조회
export const getMyProfile = async () => {
  const response = await axiosInstance.get(`${MEMBER_BASE_URL}`);
  return response.data; // MemberResponseDTO
};

// MEMBER-002: 회원 정보 수정
export const updateMyProfile = async (updateData) => {
  // updateData: { nickname, password, phone }
  const response = await axiosInstance.patch(`${MEMBER_BASE_URL}`, updateData);
  return response.data;
};

// MEMBER-005 회원탈퇴 신청
export const requestWithdraw = async (password) => {
  const response = await axiosInstance.post(`${MEMBER_BASE_URL}/withdraw`, { password });
  return response.data;
};

// MEMBER-006 회원 탈퇴 신청 취소
export const cancelWithdraw = async () => {
  const response = await axiosInstance.delete(`${MEMBER_BASE_URL}/withdraw`);
  return response.data;
};

// MEMBER-007 회원탈퇴 상태 조회
export const getWithdrawStatus = async () => {
  const response = await axiosInstance.get(`${MEMBER_BASE_URL}/withdraw`);
  return response.data; // WithdrawResponseDTO
};

// MEMBER-008: 비밀번호 재확인
export const checkMyPassword = async (password) => {
  const response = await axiosInstance.post(`${MEMBER_BASE_URL}/password/check`, {
    password,
  });
  return response.data; // boolean (matches)
};


// ASK-006: 내 문의글 목록 조회
export const getMyAskList = async (page = 1, size = 10, searchType = "", keyword = "", sort = "") => {
  const response = await axiosInstance.get(`${ASK_BASE_URL}/my`, {
    params: { page, size, searchType, keyword, sort },
  });
  return response.data; // PageResponseDTO<AskListResponseDTO>
};

// REV-010: 내 리뷰 목록 조회
export const getMyReviewList = async (page = 1, size = 10, searchType = "", keyword = "", sort = "") => {
  const response = await axiosInstance.get(`${REVIEW_BASE_URL}/me`, {
    params: { page, size, searchType, keyword, sort },
  });
  return response.data; // PageResponseDTO<MyReviewListResponseDTO>
};

// MYPOST-001: 내 댓글 목록 조회
export const getMyReplyList = async (page = 1, size = 10, searchType = "", keyword = "", sort = "") => {
  const response = await axiosInstance.get(`${MYPAGE_BASE_URL}/replies`, {
    params: { page, size, searchType, keyword, sort },
  });
  return response.data; // PageResponseDTO<MyReplyListResponseDTO>
};

// RSRV-002 예약 목록 조회
export const getMyReservationList = async (page = 1, size = 10, searchType = "", keyword = "", sort = "") => {
  const response = await axiosInstance.get(`${RESERVATION_BASE_URL}/me`, {
    params: { page, size, searchType, keyword, sort },
  });
  return response.data; // PageResponseDTO<MyReservationListResponseDTO>
};

// RSRV-003 예약 상세 조회
export const getReservationDetail = async (reservationId) => {
  const response = await axiosInstance.get(`${RESERVATION_BASE_URL}/${reservationId}`);
  return response.data; // MyReservationDetailResponseDTO
};

// PMT-004 결제 내역 목록 조회
export const getMyPaymentList = async (page = 1, size = 10, searchType = "title", keyword = "", sort = "desc") => {
  const response = await axiosInstance.get(`/api/payments/me`, {
    params: { page, size, searchType, keyword, sort },
  });
  return response.data;
};

// PMT-002 결제 상세 조회
export const getPaymentDetail = async (paymentId) => {
  const response = await axiosInstance.get(`/api/payments/${paymentId}`);
  return response.data;
};