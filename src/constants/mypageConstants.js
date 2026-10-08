/**
 * 마이페이지 전체 상수 관리
 */

// ==========================================
// 1. 예약/결제 내역 페이지 관련 상수
// ==========================================

/** 예약/결제 페이지 상단 탭 목록 */
export const RESERVATION_TABS = [
  { id: "booking", label: "예약 내역" },
  { id: "payment", label: "결제 내역" },
];

/** 예약/결제 검색 옵션 (전시명 검색) */
export const RESERVATION_SEARCH_OPTIONS = [
  { label: "전시명", value: "title" },
];

/** 예약/결제 정렬 옵션 (최신순 / 오래된순) */
export const RESERVATION_SORT_OPTIONS = [
  { label: "최신순", value: "desc" },
  { label: "오래된순", value: "asc" },
];

/** 
 * 예약 내역 테이블 컬럼 정의 
 * @param {boolean} isCompact - 상세 영수증 패널 열림 여부 (너비 조절용)
 */
export const getBookingColumns = (isCompact) => [
  { key: "bookingId", label: "예약 번호", width: isCompact ? "w-24" : "w-28", align: "center" },
  { key: "title", label: "전시명", align: "left" },
  { key: "personnel", label: "예약 인원", width: isCompact ? "w-20" : "w-28", align: "center" },
  { key: "viewDate", label: "관람일", width: isCompact ? "w-28" : "w-32", align: "center" },
  { key: "status", label: "예약 상태", width: isCompact ? "w-20" : "w-28", align: "center" },
];

/** 
 * 결제 내역 테이블 컬럼 정의 
 * @param {boolean} isCompact - 상세 영수증 패널 열림 여부 (너비 조절용)
 */
export const getPaymentColumns = (isCompact) => [
  { key: "transactionId", label: "거래 번호", width: isCompact ? "w-24" : "w-28", align: "center" },
  { key: "title", label: "전시명", align: "left" },
  { key: "amount", label: "결제 금액", width: isCompact ? "w-24" : "w-28", align: "right" },
  { key: "transactionDate", label: "결제 일시", width: isCompact ? "w-28" : "w-32", align: "center" },
  { key: "status", label: "결제 상태", width: isCompact ? "w-20" : "w-28", align: "center" },
];


// ==========================================
// 2. 내 게시물(리뷰, 문의, 댓글) 페이지 관련 상수
// ==========================================

/** 내 게시물 페이지 상단 탭 목록 (리뷰, 문의, 댓글) */
export const MYPOST_TABS = [
  { id: "review", label: "내 리뷰" },
  { id: "ask", label: "내 문의" },
  { id: "reply", label: "내 댓글" },
];

/** 내 게시물 정렬 옵션 (최신순 / 오래된순) */
export const MYPOST_SORT_OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "오래된 순", value: "oldest" },
];

/** 탭별 테이블 컬럼 구조 매핑 맵 */
export const MYPOST_COLUMNS_MAP = {
  review: [
    { key: "id", label: "번호", width: "w-24", align: "center" },
    { key: "title", label: "게시물 제목", align: "left" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  ],
  ask: [
    { key: "id", label: "번호", width: "w-24", align: "center" },
    { key: "title", label: "게시물 제목", align: "left" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  ],
  reply: [
    { key: "id", label: "번호", width: "w-24", align: "center" },
    { key: "replyContent", label: "댓글 내용", align: "left" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  ],
};

/** 
 * 활성화된 탭에 따른 검색 옵션 반환 함수
 * @param {string} activeTab - 현재 선택된 탭 ID ('review' | 'ask' | 'reply')
 */
export const getMyPostSearchOptions = (activeTab) => {
  // 댓글 탭은 내용 검색만 지원
  if (activeTab === "reply") {
    return [{ label: "내용", value: "content" }];
  }
  // 리뷰 및 문의 탭은 제목/내용 검색 지원
  return [
    { label: "제목", value: "title" },
    { label: "내용", value: "content" },
  ];
};