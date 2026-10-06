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

export const createReviewReply = async (reviewId, reviewReplyBody) => {
  const response = await axiosInstance.post(
    `${BASE_URL}/${reviewId}/replies`,
    {
      reviewReplyBody,
    }
  );

  return response.data;
};

export const updateReviewReply = async (
  reviewId,
  reviewReplyId,
  reviewReplyBody
) => {
  const response = await axiosInstance.put(
    `${BASE_URL}/${reviewId}/replies/${reviewReplyId}`,
    {
      reviewReplyBody,
    }
  );

  return response.data;
};

export const deleteReviewReply = async (reviewId, reviewReplyId) => {
  const response = await axiosInstance.delete(
    `${BASE_URL}/${reviewId}/replies/${reviewReplyId}`
  );

  return response.data;
};