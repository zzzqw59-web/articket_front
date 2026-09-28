import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";

const VisitedHistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState("latest");

  // 검색 드롭다운 옵션
  const searchOptions = [
    { label: "전시명", value: "title" },
    { label: "전시 장소", value: "place" },
  ];

  // 정렬 드롭다운 옵션
  const sortOptions = [
    { label: "최신순", value: "latest" },
    { label: "오래된순", value: "oldest" },
  ];

  // 테이블 컬럼 정의 (스토리보드 기준)
  const columns = [
  { key: "id", label: "번호", width: "w-20", align: "center" },
  { key: "title", label: "전시명", align: "left" },
  { key: "place", label: "전시 장소", width: "w-50", align: "left" },
  { key: "visitedAt", label: "관람일", width: "w-32", align: "center" },
];

  // 샘플 데이터
  const mockData = Array.from({ length: 10 }, (_, index) => ({
    id: 10 - index,
    title: `사계절을 전시에 담다 ${10 - index}`,
    place: "예술의전당 한가람미술관",
    visitedAt: "2026.08.21",
  }));

  const handleSearch = (query) => {
    console.log("관람 내역 검색:", query);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* 1. 페이지 헤더 */}
      <PageHeader
        title="관람 내역"
        description="회원님이 관람하신 전시 내역을 조회할 수 있습니다."
      />

      {/* 2. 메인 데이터 테이블 (탭 없음) */}
      <DataTableContainer
        columns={columns}
        data={mockData}
        currentPage={currentPage}
        totalPages={10}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={sortOptions}
        selectedSort={selectedSort}
        onSortChange={(sort) => setSelectedSort(sort)}
      />

      {/* 3. 하단 검색 바 (중앙 정렬) */}
      <div className="w-full max-w-xl mx-auto mt-2">
        <SearchBar options={searchOptions} onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default VisitedHistoryPage;