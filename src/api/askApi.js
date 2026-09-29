import axios from "axios";

const BASE_URL = "/api/asks";
const TEMP_MEMBER_ID = 15; // 관리자/회원 임시 ID

// 1. 문의글 목록 조회 (GET /api/asks) - [추가]
export const getAskList = async (params = {}) => {
  const {
    page = 1,
    size = 10,
    searchType,
    keyword,
    askType,
    sort,
  } = params;

  const response = await axios.get(BASE_URL, {
    params: {
      page,
      size,
      searchType,
      keyword,
      askType,
      sort,
      loginMemberId: TEMP_MEMBER_ID,
      loginMemberType: "ADMIN",
    },
  });
  return response.data; // PageResponseDTO<AskListResponseDTO> 반환
};

// 2. 문의글 상세 조회 (GET /api/asks/{askId})
export const getAskDetail = async (askId) => {
  const response = await axios.get(`${BASE_URL}/${askId}`, {
    params: {
      loginMemberId: TEMP_MEMBER_ID,
      loginMemberType: "ADMIN",
    },
  });
  return response.data;
};

// 3. 문의글 작성 (POST /api/asks - multipart/form-data)
export const createAsk = async (requestData, files = []) => {
  const formData = new FormData();

  const jsonBlob = new Blob([JSON.stringify(requestData)], {
    type: "application/json",
  });
  formData.append("requestDto", jsonBlob);

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await axios.post(BASE_URL, formData, {
    params: { memberId: TEMP_MEMBER_ID },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 4. 문의글 수정 (PUT /api/asks/{askId} - multipart/form-data)
export const updateAsk = async (askId, updateData, newFiles = []) => {
  const formData = new FormData();

  const jsonBlob = new Blob([JSON.stringify(updateData)], {
    type: "application/json",
  });
  formData.append("requestDto", jsonBlob);

  if (newFiles && newFiles.length > 0) {
    newFiles.forEach((file) => {
      formData.append("newFiles", file);
    });
  }

  const response = await axios.put(`${BASE_URL}/${askId}`, formData, {
    params: { memberId: TEMP_MEMBER_ID },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 5. 문의글 삭제 (DELETE /api/asks/{askId})
export const deleteAsk = async (askId) => {
  const response = await axios.delete(`${BASE_URL}/${askId}`, {
    params: { memberId: TEMP_MEMBER_ID },
  });
  return response.data;
};