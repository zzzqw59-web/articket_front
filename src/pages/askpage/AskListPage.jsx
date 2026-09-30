import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ActionButton from "../../components/common/ActionButton";
import MainLayout from "../../layouts/MainLayout";
import { useAskList } from "./hooks/useAskList";

import {
  ASK_TABS,
  ASK_SEARCH_OPTIONS,
  ASK_COLUMNS,
} from "../../constants/askConstants";

const AskListPage = () => {
  // 🚀 비즈니스 로직 및 페이징/검색/탭 상태 캡슐화 훅 연동
  const {
    activeTab,
    currentPage,
    selectedSort,
    askList,
    totalPages,
    isLoading,
    setCurrentPage,
    setSelectedSort,
    handleTabChange,
    handleSearch,
    handleRowClick,
    handleWriteClick,
  } = useAskList();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* 1. 페이지 헤더 */}
      <PageHeader
        title="문의 게시판"
        description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
      />

      {/* 2. 데이터 테이블 (상수 연동 및 훅 상태 바인딩) */}
      <DataTableContainer
        tabs={ASK_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        columns={ASK_COLUMNS}
        data={askList}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={[{ label: "최신순", value: "latest" }]}
        selectedSort={selectedSort}
        onSortChange={(sort) => setSelectedSort(sort)}
        onRowClick={handleRowClick}
        isLoading={isLoading}
      />

      {/* 3. 하단 검색 바 & 글쓰기 버튼 */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] items-center gap-4 w-full mt-2">
        <div className="hidden md:block"></div>

        <div className="w-full max-w-xl mx-auto">
          <SearchBar options={ASK_SEARCH_OPTIONS} onSearch={handleSearch} />
        </div>
  
        <div className="flex justify-center md:justify-end">
          <ActionButton
            label="글쓰기"
            variant="primary"
            onClick={handleWriteClick}
          />
        </div>
      </div>
    </div>
  );
};

export default AskListPage;