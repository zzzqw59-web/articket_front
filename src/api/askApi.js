import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/asks";
const EXHIBITION_PREFIX = "/api/exhibitions";

// 1. 문의글 목록 조회
export const getAskList = async (params = {}) => {
  const {
    page = 1,
    size = 10,
    searchType,
    keyword,
    askType,
    sort,
  } = params;

  const response = await axiosInstance.get(BASE_URL, {
    params: {
      page,
      size,
      searchType,
      keyword,
      askType,
      sort,
    },
  });
  return response.data;
};

// 2. 문의글 상세 조회
export const getAskDetail = async (askId) => {
  const response = await axiosInstance.get(`${BASE_URL}/${askId}`);
  return response.data;
};

// 3. 문의글 작성 (multipart/form-data)
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

  const response = await axiosInstance.post(BASE_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 3-1. 문의글 작성용 전시회 검색
export const getExhibitionSearchListForAsk = async ({
  keyword = "",
  page = 0,
  size = 5,
} = {}) => {
  try {
    const [freeRes, paidRes] = await Promise.all([
      axiosInstance.get(EXHIBITION_PREFIX, {
        params: { keyword, page, size, free: true },
      }),
      axiosInstance.get(EXHIBITION_PREFIX, {
        params: { keyword, page, size, free: false },
      }),
    ]);

    const freeItems = freeRes.data.content || freeRes.data.dtoList || freeRes.data || [];
    const paidItems = paidRes.data.content || paidRes.data.dtoList || paidRes.data || [];

    const combined = [...freeItems, ...paidItems];
    return combined.slice(0, size);
  } catch (error) {
    console.error("전시 통합 검색 실패:", error);
    return [];
  }
};

// 4. 문의글 수정 (multipart/form-data)
export const updateAsk = async (askId, data, files = []) => {
  const formData = new FormData();

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

  const response = await axiosInstance.put(`${BASE_URL}/${askId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 5. 문의글 삭제
export const deleteAsk = async (askId) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${askId}`);
  return response.data;
};