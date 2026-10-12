import axiosInstance from "./axiosInstance";
import { getStoredUser } from "../constants/config";

const BASE_URL = "/api/wishes";

//현재 로그인한 회원 Id 가져오기
const getCurrentMemberId = () => {
  const user = getStoredUser();

  if(!user?.memberId) {
  throw new Error("로그인 사용자 정보를 찿을 수 없습니다.");
}
return user.memberId;
}

// 내 위시리스트 목록 조회
export const getMyWishList = async (page = 1, size = 10) => {
  const response = await axiosInstance.get(`${BASE_URL}/me`, {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

// 위시 토글 (추가 / 취소)
export const toggleWish = async (exhibitionId) => {
  const memberId = getCurrentMemberId();
  const response = await axiosInstance.post(
    `${BASE_URL}/${exhibitionId}`,
    null,
    {
      params: {
        memberId
      },
    },
  );
  return response.data; // WishToggleResponseDTO 반환
};

// 추가 기능: 위시 카운트 조회...
export const countWish = async (exhibitionId) => {
  const memberId = getCurrentMemberId();
  const response = await axiosInstance.get(
    `${BASE_URL}/count/${exhibitionId}`,
    {
      params: {
        memberId
      },
    },
  );
  return response.data;
};

// 특정 전시의 총 위시 수 및 내 찜 여부 조회
export const getWishCount = async (exhibitionId) => {
  const response = await axiosInstance.get(`${BASE_URL}/count/${exhibitionId}`);
  return response.data;
};

// 만료된 위시 일괄 삭제
export const deleteExpiredWishes = async () => {
  const response = await axiosInstance.delete(`${BASE_URL}/deleteexpired`);
  return response.data;
};

// 전체 위시 일괄 삭제
export const deleteAllWishes = async () => {
  const response = await axiosInstance.delete(`${BASE_URL}/deleteall`);
  return response.data;
};
