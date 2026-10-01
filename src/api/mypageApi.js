import axios from "axios";
import { TEMP_MEMBER_ID } from "../constants/config"; // 임시 회원 ID constants/config.js에서 가져오기

const BASE_URL = "/api/asks"; // "/api/mypage" 에서 수정

// 1. 내 문의글 목록 조회
export const getMyAskList = async (page = 1, size = 10, searchType = "", keyword = "") => {
  const response = await axios.get(`${BASE_URL}/my`, {
    params: { memberId: TEMP_MEMBER_ID, page, size, searchType, keyword },
  });
  return response.data; // PageResponseDTO<AskListResponseDTO>
};