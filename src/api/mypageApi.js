import axios from "axios";

const BASE_URL = "/api/asks"; // "/api/mypage" 에서 수정
const TEMP_MEMBER_ID = 15; // 인증 구현 전 임시 회원 ID

// 1. 내 문의글 목록 조회
export const getMyAskList = async (page = 1, size = 10, searchType = "", keyword = "") => {
  const response = await axios.get(`${BASE_URL}/my`, {
    params: { memberId: TEMP_MEMBER_ID, page, size, searchType, keyword },
  });
  return response.data; // PageResponseDTO<AskListResponseDTO>
};