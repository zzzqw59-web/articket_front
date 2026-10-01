import axios from "axios";
import { CURRENT_USER } from "../constants/config";

const BASE_URL = "/api/wishes";

// 임시 회원 설정
// const CURRENT_USER = {memberId: 1};

// 내 위시리스트 목록 조회
export const getMyWishList = async (page = 0, size = 10) => {
  const response = await axios.get(`${BASE_URL}/me`, {
    params: {
      memberId: CURRENT_USER.memberId,
      page,
      size,
    },
  });
  return response.data; // PageResponseDTO 반환
};

// 위시 토글 (추가 / 취소) -> 찜 해제 버튼에 활용
export const toggleWish = async (exhibitionId) => {
  const response = await axios.post(`${BASE_URL}/${exhibitionId}`, null, {
    params: {
      memberId: CURRENT_USER.memberId,
    },
  });
  return response.data; // WishToggleResponseDTO 반환
};

// 추가 기능: 위시 카운트 조회
export const countWish = async (exhibitionId) => {
  const response = await axios.get(
    `${BASE_URL}/count/${exhibitionId}`,{
      params: {
        memberId: CURRENT_USER.memberId,
      },
    });
  return response.data;
};