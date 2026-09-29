import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import { getMyAskList } from "../../api/mypageApi"; // 방금 만든 API 임포트

const MyPostPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ask"); // 내 문의를 먼저 테스트하기 위해 기본값 설정
  const [currentPage, setCurrentPage] = useState(1);

  // API 데이터 상태
  const [askList, setAskList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // 검색 상태 관리
  const [searchQuery, setSearchQuery] = useState({ searchType: "title", keyword: "" });

  // 탭 설정 및 컬럼 설정 (기존 코드 유지)
  const tabs = [
    { id: "review", label: "내 리뷰" },
    { id: "ask", label: "내 문의" },
    { id: "reply", label: "내 댓글" },
  ];

  const postColumns = [
    { key: "id", label: "번호", width: "w-24", align: "center" },
    { key: "title", label: "게시물 제목", align: "left" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  ];

  const postSearchOptions = [
    { label: "제목", value: "title" },
    { label: "내용", value: "content" },
  ];

  // 내 문의 데이터 호출 (useEffect)
  useEffect(() => {
    if (activeTab === "ask") {
      fetchMyAsks();
    }
  }, [activeTab, currentPage, searchQuery]);

  const fetchMyAsks = async () => {
    try {
      const response = await getMyAskList(currentPage, 10, searchQuery.searchType, searchQuery.keyword);
      
      // 백엔드 PageResponseDTO -> 프론트 테이블 포맷으로 매핑
      const formattedData = response.dtoList.map((item) => ({
        id: item.askId,
        title: item.askTitle,
        createdAt: item.askCreatedAt ? item.askCreatedAt.substring(0, 10) : "",
        targetUrl: `/articket/ask/${item.askId}`,
      }));

      setAskList(formattedData);
      setTotalPages(response.totalPage || 1);
    } catch (error) {
      console.error("내 문의 목록을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  // 탭에 따른 데이터 반환
  const getData = () => {
    switch (activeTab) {
      case "ask":
        return askList; // 실제 API 데이터 바인딩
      case "review":
      case "reply":
      default:
        return []; // 추후 연동 전까지 임시 빈 배열 또는 목업 유지
    }
  };

  const handleRowClick = (row) => {
    if (row.targetUrl) navigate(row.targetUrl);
  };

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <PageHeader
        title="내 게시물"
        description="회원님이 등록하신 게시물 내역을 조회할 수 있습니다."
      />

      <DataTableContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setCurrentPage(1);
        }}
        columns={postColumns}
        data={getData()}
        currentPage={currentPage}
        totalPages={activeTab === "ask" ? totalPages : 1}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={[{ label: "최신순", value: "latest" }]}
        onRowClick={handleRowClick}
      />

      {activeTab === "ask" && (
        <div className="w-full max-w-xl mx-auto mt-2">
          <SearchBar
            options={postSearchOptions}
            onSearch={(searchType, keyword) => {
              setSearchQuery({ searchType, keyword });
              setCurrentPage(1); // 검색 시 1페이지로 초기화
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyPostPage;