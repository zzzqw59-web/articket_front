import axios from "axios";
import { TEMP_MEMBER_ID } from "../constants/config"; // 임시 회원 ID constants/config.js에서 가져오기

const BASE_URL = "/api/asks";
const EXHIBITION_PREFIX = "/api/exhibitions"; // 👈 전시 API용 경로 추가

// 1. 문의글 목록 조회 (GET /api/asks)
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
    },
  });
  return response.data;
};

// 2. 문의글 상세 조회 (GET /api/asks/{askId})
export const getAskDetail = async (askId) => {
  const response = await axios.get(`${BASE_URL}/${askId}`, {
    params: {
      loginMemberId: TEMP_MEMBER_ID,
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

// 3-1. 문의글 작성용 전시회 검색 (GET /api/exhibitions)
// 문의글 작성용 전시회 검색 (유료 + 무료 전체 합치기)
export const getExhibitionSearchListForAsk = async ({
    keyword = "",
    page = 0,
    size = 5,
} = {}) => {
    try {
        // 무료 전시와 유료 전시를 각각 요청
        const [freeRes, paidRes] = await Promise.all([
            axios.get(EXHIBITION_PREFIX, {
                params: { keyword, page, size, free: true },
                withCredentials: true,
            }),
            axios.get(EXHIBITION_PREFIX, {
                params: { keyword, page, size, free: false },
                withCredentials: true,
            }),
        ]);

        const freeItems = freeRes.data.content || freeRes.data.dtoList || freeRes.data || [];
        const paidItems = paidRes.data.content || paidRes.data.dtoList || paidRes.data || [];

        // 두 결과를 합침 (중복 제거가 필요하다면 id 기준 처리)
        const combined = [...freeItems, ...paidItems];
        
        // 검색된 키워드에 맞게 프론트엔드에서 한번 더 필터링 및 사이즈 자르기
        return combined.slice(0, size);
    } catch (error) {
        console.error("전시 통합 검색 실패:", error);
        return [];
    }
};

// 4. 문의글 수정 (PUT /api/asks/{askId} - multipart/form-data)
export const updateAsk = async (askId, data, files = []) => {
  const formData = new FormData();

  // 💡 상위 컴포넌트에서 { requestDto, newFiles } 객체로 넘기든, 개별 인자로 넘기든 모두 수용하도록 방어 코드 추가
  const requestDto = data.requestDto || data;
  const newFiles = files.length > 0 ? files : (data.newFiles || []);

  const jsonBlob = new Blob([JSON.stringify(requestDto)], {
    type: "application/json",
  });
  formData.append("requestDto", jsonBlob);

  if (newFiles && newFiles.length > 0) {
    newFiles.forEach((file) => {
      if (file) {
        formData.append("newFiles", file);
      }
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