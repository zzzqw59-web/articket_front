import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ActionButton from "../../components/common/ActionButton";
import MainLayout from "../../layouts/MainLayout";

const AskListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("exhibition");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState("latest");

  // 1. 문의 게시판 탭 목록 (전시 / 사이트 / 기타)
  const tabs = [
    { id: "exhibition", label: "전시" },
    { id: "site", label: "사이트" },
    { id: "etc", label: "기타" },
  ];

  // 2. 검색 카테고리 옵션
  const searchOptions = [
    { label: "제목", value: "title" },
    { label: "내용", value: "content" },
    { label: "작성자", value: "writer" },
  ];

  // 3. 문의 게시판 테이블 컬럼
  const columns = [
    { key: "id", label: "문의 번호", width: "w-28", align: "center" },
    { key: "title", label: "제목", align: "left" },
    { key: "writer", label: "작성자", width: "w-32", align: "center" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
    { key: "views", label: "조회수", width: "w-24", align: "center" },
  ];

  // 4. 샘플 데이터
  const mockData = Array.from({ length: 10 }, (_, index) => ({
    id: 10 - index,
    title: `적당한 문의 제목[${index + 1}]`,
    writer: "작성자",
    createdAt: "2026.09.28",
    views: "조회수",
  }));

  // 글쓰기 버튼 클릭 이벤트 핸들러
  const handleWriteClick = () => {
    navigate("/articket/ask/write");
  };

  return (
    <MainLayout>
        <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
            {/* 1. 공통 페이지 헤더 */}
            <PageHeader
                title="문의 게시판"
                description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
            />

            {/* 2. 메인 데이터 테이블 (탭 + 테이블 + 페이지네이션) */}
            <DataTableContainer
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId)}
                columns={columns}
                data={mockData}
                currentPage={currentPage}
                totalPages={10}
                onPageChange={(page) => setCurrentPage(page)}
                sortOptions={[{ label: "최신순", value: "latest" }]}
                selectedSort={selectedSort}
                onSortChange={(sort) => setSelectedSort(sort)}
            />

            {/* 3. 하단 검색 바 & 글쓰기 버튼 (비율 1 : 3 : 1) */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] items-center gap-4 w-full mt-2">
                {/* 1열: 좌측 여백 균형 */}
                <div className="hidden md:block"></div>

                {/* 2열: 가운데 검색 바 */}
                <div className="w-full max-w-xl mx-auto">
                <SearchBar
                    options={searchOptions}
                    onSearch={(query) => console.log("문의 검색 실행:", query)}
                />
                </div>

                {/* 3열: 우측 글쓰기 버튼 */}
                <div className="flex justify-center md:justify-end">
                <ActionButton
                    label="글쓰기"
                    variant="primary"
                    onClick={handleWriteClick}
                />
                </div>
            </div>
        </div>
    </MainLayout>
    
  );
};

export default AskListPage;