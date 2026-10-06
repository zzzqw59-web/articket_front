import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/reviews";

export const getReviewReplyList = async (reviewId, page = 1, size = 10) => {
  const response = await axiosInstance.get(
    `${BASE_URL}/${reviewId}/replies`,
    {
      params: {
        page,
        size,
      },
    }
  );

  return response.data;
};