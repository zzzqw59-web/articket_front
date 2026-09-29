/**
 * 문의하기(Ask) 관련 상수 관리
 */

// 1. 이미지 첨부 관련 상수
export const ASK_IMAGE_LIMIT = 3;

// 2. 카테고리 텍스트 <-> askType(Integer 코드) 매핑
export const CATEGORY_MAP = {
  "전시 관련 문의": 1,
  "사이트 관련 문의": 2,
  "기타": 0,
};

export const REVERSE_CATEGORY_MAP = {
  1: "전시 관련 문의",
  2: "사이트 관련 문의",
  0: "기타",
};

// 3. 드롭다운 선택 옵션 목록
export const ASK_CATEGORY_OPTIONS = [
  { value: "전시 관련 문의", label: "전시 관련 문의" },
  { value: "사이트 관련 문의", label: "사이트 관련 문의" },
  { value: "기타", label: "기타" },
];