export const REVIEW_COLUMNS = [
  { key: "id", label: "리뷰 번호", width: "w-28", align: "center" },
  { key: "title", label: "제목", align: "left" },
  { key: "writer", label: "작성자", width: "w-32", align: "center" },
  { key: "createdAt", label: "작성일", width: "w-40", align: "center" },
  { key: "views", label: "조회수", width: "w-24", align: "center" },
];

export const REVIEW_SEARCH_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "제목", value: "title" },
  { label: "작성자", value: "writer" },
  { label: "전시", value: "exhibition" },
];