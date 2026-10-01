import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/asks";

// 1. 댓글 목록 조회
export const getReplyList = async (askId, page = 1, size = 10) => {
  const response = await axiosInstance.get(`${BASE_URL}/${askId}/replies`, {
    params: { page, size },
  });
  return response.data; // PageResponseDTO<AskReplyDTO>
};

// 2. 댓글 등록 (JWT 토큰 기반)
export const createReply = async (askId, askReplyBody) => {
  // 백엔드 DTO 매핑 방식에 따라 { askReplyBody } 또는 { content: askReplyBody } 형태로 전달
  const response = await axiosInstance.post(
    `${BASE_URL}/${askId}/replies`,
    typeof askReplyBody === "string" ? { askReplyBody } : askReplyBody
  );
  return response.data; // replyId 반환
};


 // 3. 댓글 수정 (JWT 토큰 기반)
export const updateReply = async (askId, replyId, askReplyBody) => {
  const response = await axiosInstance.put(
    `${BASE_URL}/${askId}/replies/${replyId}`,
    typeof askReplyBody === "string" ? { askReplyBody } : askReplyBody
  );
  return response.data;
};

 // 4. 댓글 삭제 (JWT 토큰 기반)
export const deleteReply = async (askId, replyId) => {
  const response = await axiosInstance.delete(
    `${BASE_URL}/${askId}/replies/${replyId}`
  );
  return response.data;
};