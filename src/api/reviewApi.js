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






/**
 * 1. 문의글 목록 조회
 */
export const getAskList = async (params = {}) => {
  const response = await axiosInstance.get(BASE_URL, { params });
  return response.data;
};

/**
 * 2. 문의글 상세 조회
 */
export const getAskDetail = async (askId) => {
  const response = await axiosInstance.get(`${BASE_URL}/${askId}`);
  return response.data;
};

/**
 * 3. 문의글 작성
 */
export const createAsk = async (requestData, files = []) => {
  const formData = new FormData();

  const jsonBlob = new Blob([JSON.stringify(requestData)], {
    type: "application/json",
  });
  formData.append("requestDto", jsonBlob);

  if (files && files.length > 0) {
    files.forEach((file) => formData.append("files", file));
  }

  // 💡 FormData 전송 시 Content-Type 헤더를 명시하지 않아야 Axios가 Boundary를 자동으로 맞춰줍니다.
  const response = await axiosInstance.post(BASE_URL, formData);
  return response.data;
};

/**
 * 3-1. 문의글 작성용 전시회 통합 검색 (무료/유료 백엔드 API 병렬 호출)
 */
export const getExhibitionSearchListForAsk = async ({
  keyword = "",
  page = 0,
  size = 5,
} = {}) => {
  try {
    // 백엔드의 free=true / free=false 분기 조건에 맞춰 병렬 호출 (Promise.all)
    const [freeRes, paidRes] = await Promise.all([
      axiosInstance.get(EXHIBITION_PREFIX, {
        params: { keyword, page, size, free: true },
      }),
      axiosInstance.get(EXHIBITION_PREFIX, {
        params: { keyword, page, size, free: false },
      }),
    ]);

    // Page<ExhibitionListItemDTO> 응답 구조 (content) 또는 dtoList 호환 처리
    const freeItems = freeRes.data?.content || freeRes.data?.dtoList || freeRes.data || [];
    const paidItems = paidRes.data?.content || paidRes.data?.dtoList || paidRes.data || [];

    const combined = [...freeItems, ...paidItems];
    return combined.slice(0, size);
  } catch (error) {
    console.error("전시 통합 검색 실패:", error);
    return [];
  }
};

/**
 * 4. 문의글 수정
 */
export const updateAsk = async (askId, data, files = []) => {
  const formData = new FormData();

  const requestDto = data.requestDto || data;
  const newFiles = files.length > 0 ? files : data.newFiles || [];

  const jsonBlob = new Blob([JSON.stringify(requestDto)], {
    type: "application/json",
  });
  formData.append("requestDto", jsonBlob);

  if (newFiles && newFiles.length > 0) {
    newFiles.forEach((file) => {
      if (file) formData.append("newFiles", file);
    });
  }

  const response = await axiosInstance.put(`${BASE_URL}/${askId}`, formData);
  return response.data;
};

/**
 * 5. 문의글 삭제
 */
export const deleteAsk = async (askId) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${askId}`);
  return response.data;
};