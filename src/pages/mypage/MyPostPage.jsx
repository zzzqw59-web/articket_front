import React, { useState } from "react";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ActionButton from "../../components/common/ActionButton";

const MyPostPage = () => {
  const [activeTab, setActiveTab] = useState("review");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. 탭 설정
  const tabs = [
    { id: "review", label: "내 리뷰" },
    { id: "ask", label: "내 문의" },
    { id: "reply", label: "내 댓글" },
  ];

  // 2. 검색 드롭다운 카테고리 옵션 배열
  const searchOptions = [
    { label: "제목", value: "title" },
    { label: "내용", value: "content" },
  ];

  // 3. 컬럼 구성
  const columns = [
    { key: "id", label: "번호", width: "w-24", align: "center" },
    { key: "title", label: "게시물 제목" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
  ];

  // 4. 샘플 데이터
  const mockData = [
    { id: 1, title: "게시물 제목[2]", createdAt: "2026.09.28" },
    { id: 2, title: "게시물 제목[1]", createdAt: "2026.09.27" },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 메인 표 컴포넌트 (탭 + 테이블 + 페이지네이션 통합) */}
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
      />

        {/* 하단 검색 바 & 액션 버튼 영역 (비율 1 : 3 : 1) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] items-center gap-4 w-full mt-4">
            {/* 1열: 좌측 여백 균형 레이아웃 */}
            <div className="hidden md:block"></div>

            {/* 2열: 가운데 넓은 검색 바 (최대 max-w-xl까지 확장) */}
            <div className="w-full max-w-xl mx-auto">
                <SearchBar
                options={searchOptions}
                onSearch={(query) => console.log("검색 실행:", query)}
                />
            </div>

            {/* 3열: 우측 끝 액션 버튼 */}
            <div className="flex justify-center md:justify-end">
                <ActionButton
                label="글쓰기"
                variant="primary"
                onClick={() => alert("글쓰기 페이지로 이동")}
                />
            </div>
        </div>
    </div>
  );
};

export default MyPostPage;