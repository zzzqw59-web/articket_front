import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";

const MyPostPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("review");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. 탭 설정
  const tabs = [
    { id: "review", label: "내 리뷰" },
    { id: "ask", label: "내 문의" },
    { id: "reply", label: "내 댓글" },
  ];

  // 2. 탭별 컬럼 구성
  const postColumns = [
    { key: "id", label: "번호", width: "w-24", align: "center" },
    { key: "title", label: "게시물 제목", align: "left" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  ];

  const replyColumns = [
    { key: "id", label: "번호", width: "w-24", align: "center" },
    { key: "content", label: "댓글 내용", align: "left" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  ];

  // 3. 탭별 검색 옵션
  const postSearchOptions = [
    { label: "제목", value: "title" },
    { label: "내용", value: "content" },
  ];

  const replySearchOptions = [{ label: "댓글 내용", value: "content" }];

  // 4. 샘플 데이터
  const mockReviewData = [
    {
      id: 1,
      title: "사계절 전시에 대한 솔직 리뷰 [2]",
      createdAt: "2026.09.28",
      targetUrl: "/articket/review/1",
    },
    {
      id: 2,
      title: "인상주의 특별전 방문 후기 [1]",
      createdAt: "2026.09.27",
      targetUrl: "/articket/review/2",
    },
  ];

  const mockAskData = [
    {
      id: 1,
      title: "가족과 함께 방문해도 괜찮을까요?",
      createdAt: "2026.09.21",
      targetUrl: "/articket/ask/1",
    },
  ];

  const mockReplyData = [
    {
      id: 1,
      content: "좋은 정보 감사합니다! 이번 주말에 꼭 가봐야겠네요.",
      createdAt: "2026.09.28",
      targetUrl: "/articket/ask/1",
    },
    {
      id: 2,
      content: "주차장이 다소 협소하니 대중교통 이용을 추천합니다.",
      createdAt: "2026.09.25",
      targetUrl: "/articket/review/5",
    },
  ];

  // 탭 상태에 따른 헬퍼
  const getColumns = () => (activeTab === "reply" ? replyColumns : postColumns);
  const getSearchOptions = () =>
    activeTab === "reply" ? replySearchOptions : postSearchOptions;

  const getData = () => {
    switch (activeTab) {
      case "ask":
        return mockAskData;
      case "reply":
        return mockReplyData;
      case "review":
      default:
        return mockReviewData;
    }
  };

  const handleRowClick = (row) => {
    if (row.targetUrl) navigate(row.targetUrl);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 메인 표 컴포넌트 */}
      <DataTableContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setCurrentPage(1);
        }}
        columns={getColumns()}
        data={getData()}
        currentPage={currentPage}
        totalPages={10}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={[{ label: "최신순", value: "latest" }]}
        onRowClick={handleRowClick}
      />

      {/* 하단 검색 바 (중앙 정렬) */}
      <div className="w-full max-w-xl mx-auto mt-2">
        <SearchBar
          options={getSearchOptions()}
          onSearch={(query) => console.log(`${activeTab} 검색:`, query)}
        />
      </div>
    </div>
  );
};

export default MyPostPage;