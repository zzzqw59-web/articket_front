import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ActionButton from "../../components/common/ActionButton";
import MainLayout from "../../layouts/MainLayout";
import { getAskList } from "../../api/askApi"; // [추가] API 모듈 연동

const AskListPage = () => {
  const navigate = useNavigate();

  // 1. 탭 상태 (백엔드 askType 매핑: 전체 null 또는 1: 전시, 2: 사이트, 3: 기타)
  // 정수형 카테고리 값으로 관리
  const [activeTab, setActiveTab] = useState("all"); 

  // 2. 검색, 페이징, 정렬 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState("latest");
  const [searchParams, setSearchParams] = useState({
    searchType: "",
    keyword: "",
  });

  // 3. API 서버 응답 데이터 상태
  const [askList, setAskList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 탭 목록 정의 (백엔드 askType과 매핑)
  const tabs = [
    { id: "all", label: "전체" },
    { id: "1", label: "전시" },
    { id: "2", label: "사이트" },
    { id: "3", label: "기타" },
  ];

  // 검색 옵션
  const searchOptions = [
    { label: "제목", value: "title" },
    { label: "내용", value: "content" },
    { label: "작성자", value: "writer" },
  ];

  // 테이블 컬럼 정의
  const columns = [
    { key: "id", label: "문의 번호", width: "w-28", align: "center" },
    { key: "title", label: "제목", align: "left" },
    { key: "writer", label: "작성자", width: "w-32", align: "center" },
    { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
    { key: "views", label: "조회수", width: "w-24", align: "center" },
  ];

  // [핵심] 백엔드 API 연동 함수
  const fetchAskList = useCallback(async () => {
    setIsLoading(true);
    try {
      // API 전송용 파라미터 구성
      const params = {
        page: currentPage,
        size: 10,
        sort: selectedSort,
        ...(activeTab !== "all" && { askType: parseInt(activeTab, 10) }),
        ...(searchParams.keyword && {
          searchType: searchParams.searchType,
          keyword: searchParams.keyword,
        }),
      };

      const response = await getAskList(params);

      // PageResponseDTO 구조에 따른 데이터 바인딩
      // AskListResponseDTO -> Table Row Data 매핑
      if (response && response.dtoList) {
        const formattedData = response.dtoList.map((item) => ({
          id: item.askId,
          // 비밀글 및 답변/이미지 수 표시 처리
          title: `${item.askSecret === 1 ? "🔒 " : ""}${item.askTitle}${
            item.replyCount > 0 ? ` [${item.replyCount}]` : ""
          }${item.hasImage ? " 📎" : ""}`,
          writer: item.memberNickname || "익명",
          createdAt: item.askCreatedAt ? item.askCreatedAt.split(" ")[0] : "", // YYYY-MM-DD
          views: item.askHits ?? 0,
          rawItem: item, // 행 클릭 시 전달할 원본 데이터
        }));

        setAskList(formattedData);
        setTotalPages(response.totalPage || 1);
      }
    } catch (error) {
      console.error("문의 목록 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeTab, selectedSort, searchParams]);

  // 조건 변경 시 API 다시 호출
  useEffect(() => {
    fetchAskList();
  }, [fetchAskList]);

  // 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // 탭 변경 시 1페이지로 리셋
  };

  // 검색 핸들러
  const handleSearch = ({ type, keyword }) => {
    setSearchParams({ searchType: type, keyword });
    setCurrentPage(1); // 검색 시 1페이지로 리셋
  };

  // 상세 페이지 이동 핸들러
  const handleRowClick = (row) => {
    navigate(`/articket/ask/${row.id}`);
  };

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

        {/* 2. 메인 데이터 테이블 */}
        <DataTableContainer
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          columns={columns}
          data={askList}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          sortOptions={[{ label: "최신순", value: "latest" }]}
          selectedSort={selectedSort}
          onSortChange={(sort) => setSelectedSort(sort)}
          onRowClick={handleRowClick} // 행 클릭 시 상세 페이지 이동
          isLoading={isLoading}
        />

        {/* 3. 하단 검색 바 & 글쓰기 버튼 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] items-center gap-4 w-full mt-2">
          <div className="hidden md:block"></div>

          <div className="w-full max-w-xl mx-auto">
            <SearchBar options={searchOptions} onSearch={handleSearch} />
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
    </MainLayout>
  );
};

export default AskListPage;