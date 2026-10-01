import axios from "axios";
import { TEMP_MEMBER_ID } from "../constants/config"; // 임시 회원 ID constants/config.js에서 가져오기

const BASE_URL = "/api/asks";

// 1. 댓글 목록 조회
export const getReplyList = async (askId, page = 1, size = 10) => {
  const response = await axios.get(`${BASE_URL}/${askId}/replies`, {
    params: { page, size },
  });
  return response.data; // PageResponseDTO<AskReplyDTO>
};

// 2. 댓글 등록
export const createReply = async (askId, askReplyBody) => {
  const response = await axios.post(
    `${BASE_URL}/${askId}/replies`,
    { askReplyBody },
    { params: { memberId: TEMP_MEMBER_ID } }
  );
  return response.data; // replyId 반환
};

// 3. 댓글 수정
export const updateReply = async (askId, replyId, askReplyBody) => {
  console.log("🚀 updateReply 전송 payload:", { askReplyBody }); // 콘솔에서 값 확인

  const response = await axios.put(
    `/api/asks/${askId}/replies/${replyId}`,
    {
      askReplyBody: askReplyBody, // 👈 DTO 필드명과 정확히 일치해야 함
    },
    {
      params: {
        memberId: 15, // 관리자 계정 ID
      },
    }
  );
  return response.data;
};

// 4. 댓글 삭제
export const deleteReply = async (askId, replyId) => {
  const response = await axios.delete(
    `${BASE_URL}/${askId}/replies/${replyId}`,
    { params: { memberId: TEMP_MEMBER_ID } }
  );
  return response.data;
};