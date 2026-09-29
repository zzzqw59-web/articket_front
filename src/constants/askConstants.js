/**
 * 문의하기(Ask) 관련 상수 관리
 */

// 1. 이미지 첨부 관련 상수
export const ASK_IMAGE_LIMIT = 3;

// 2. 카테고리 텍스트 <-> askType(Integer 코드) 매핑
export const CATEGORY_MAP = {
  "전시 관련 문의": 1,
  "사이트 관련 문의": 2,
  기타: 0,
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

// 🚀 4. 문의 목록 탭 옵션
export const ASK_TABS = [
  { id: "all", label: "전체" },
  { id: "1", label: "전시" },
  { id: "2", label: "사이트" },
  { id: "0", label: "기타" }, // 백엔드 askType 0 매핑
];

// 🚀 5. 문의 목록 검색 옵션
export const ASK_SEARCH_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "제목", value: "title" },
  { label: "작성자", value: "writer" },
  { label: "전시", value: "exhibition" },
];

// 🚀 6. 문의 목록 테이블 컬럼 정의
export const ASK_COLUMNS = [
  { key: "id", label: "문의 번호", width: "w-28", align: "center" },
  { key: "title", label: "제목", align: "left" },
  { key: "writer", label: "작성자", width: "w-32", align: "center" },
  { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  { key: "views", label: "조회수", width: "w-24", align: "center" },
];