import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import { 
  VISITED_SEARCH_OPTIONS, 
  VISITED_SORT_OPTIONS, 
  VISITED_COLUMNS 
} from "../../constants/mypageConstants";
import { getMyVisitedHistoryList } from "../../api/mypageApi"; // 💡 API 임포트

const VisitedHistoryPage = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSelectedSort] = useState("latest-reservation");
  
  // 검색 상태 관리
  const [searchParams, setSearchParams] = useState({ searchType: "", keyword: "" });
  const [loading, setLoading] = useState(false);

  // 관람 내역 데이터 페치 함수
  const fetchVisitedHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyVisitedHistoryList(
        currentPage,
        10, // size
        searchParams.searchType,
        searchParams.keyword,
        selectedSort
      );

      // PageResponseDTO 구조 대응 (dtoList, totalPage 등)
      setDataList(response.dtoList || []);
      setTotalPages(response.totalPage || 1);
    } catch (error) {
      console.error("관람 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchParams, selectedSort]);

  // 페이지, 검색 조건, 정렬 변경 시 데이터 재호출
  useEffect(() => {
    fetchVisitedHistory();
  }, [fetchVisitedHistory]);

  // 검색 실행 핸들러
  const handleSearch = (query) => {
    // query 예시: { searchType: "title", keyword: "사계절" } 또는 공백 초기화 시
    setSearchParams({
      searchType: query.searchType || "",
      keyword: query.keyword || "",
    });
    setCurrentPage(1); // 검색 시 첫 페이지로 초기화
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 초기화
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* 1. 페이지 헤더 */}
      <PageHeader
        title="관람 내역"
        description="회원님이 관람하신 전시 내역을 조회할 수 있습니다."
      />

      {/* 2. 메인 데이터 테이블 */}
      <DataTableContainer
        columns={VISITED_COLUMNS}
        data={dataList}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={VISITED_SORT_OPTIONS}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        isLoading={loading}
      />

      {/* 3. 하단 검색 바 (중앙 정렬) */}
      <div className="w-full max-w-xl mx-auto mt-2">
        <SearchBar 
          options={VISITED_SEARCH_OPTIONS} 
          onSearch={handleSearch} 
        />
      </div>
    </div>
  );
};

export default VisitedHistoryPage;