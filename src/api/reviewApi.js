import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/reviews"

// 리뷰 목록 조회
export const getReviewList = async(params = {}) => {
    const response = await axiosInstance.get(BASE_URL, {params});
    console.log("정상 작동");
    console.log(response.data);
    return response.data;
}

// 리뷰 상세 조회
export const getReviewDetail = async (reviewId) => {
  const response = await axiosInstance.get(`${BASE_URL}/${reviewId}`);
  return response.data;
};

// 리뷰 작성
export const createReview = async (formData) => {
  const response = await axiosInstance.post(
    BASE_URL,
    formData
  );

  return response.data;
};

// 리뷰 수정
export const updateReview = async (reviewId, formData) => {
  const response = await axiosInstance.put(
    `${BASE_URL}/${reviewId}`,
    formData
  );

  return response.data;
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(
    `${BASE_URL}/${reviewId}`
  );

  return response.data;
};