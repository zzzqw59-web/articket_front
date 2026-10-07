import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import { getMyAskList, getMyReviewList } from "../../api/mypageApi";

const MyPostPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("review");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState({ searchType: "title", keyword: "" });

  // 1. 탭별 통합 데이터 상태 관리 (목록 & totalPages)
  const [postData, setPostData] = useState({
    review: { list: [], totalPages: 1 },
    ask: { list: [], totalPages: 1 },
    reply: { list: [], totalPages: 1 }, // 추후 내 댓글용
  });

  const [isLoading, setIsLoading] = useState(false);

  // 탭 목록 설정
  const tabs = [
    { id: "review", label: "내 리뷰" },
    { id: "ask", label: "내 문의" },
    { id: "reply", label: "내 댓글" },
  ];

  // 2. 탭별 테이블 컬럼 설정 (댓글 탭 확장성 대응)
  const columnsMap = {
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
      { key: "id", label: "번호", width: "w-20", align: "center" },
      { key: "replyContent", label: "댓글 내용", align: "left" }, // 댓글 전용 컬럼
      { key: "title", label: "원문 제목", align: "left" },
      { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
    ],
  };

  const postSearchOptions = [
    { label: "제목", value: "title" },
    { label: "내용", value: "content" },
  ];

  // 탭 변경 처리
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchQuery({ searchType: "title", keyword: "" });
  };

  // 3. 통합 데이터 Fetch 함수
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let response = null;
      let formattedList = [];

      if (activeTab === "review") {
        response = await getMyReviewList(
          currentPage,
          10,
          searchQuery.searchType,
          searchQuery.keyword
        );
        formattedList = (response.dtoList || []).map((item) => ({
          id: item.reviewId,
          title: item.reviewTitle,
          createdAt: item.reviewCreatedAt ? item.reviewCreatedAt.substring(0, 10) : "",
          targetUrl: `/articket/review/${item.reviewId}`,
        }));
      } else if (activeTab === "ask") {
        response = await getMyAskList(
          currentPage,
          10,
          searchQuery.searchType,
          searchQuery.keyword
        );
        formattedList = (response.dtoList || []).map((item) => ({
          id: item.askId,
          title: item.askTitle,
          createdAt: item.askCreatedAt ? item.askCreatedAt.substring(0, 10) : "",
          targetUrl: `/articket/ask/${item.askId}`,
        }));
      } else if (activeTab === "reply") {
        // TODO: 추후 getMyReplyList(currentPage, 10, ...) 연동
        // response = await getMyReplyList(...);
      }

      if (response) {
        setPostData((prev) => ({
          ...prev,
          [activeTab]: {
            list: formattedList,
            totalPages: response.totalPage || 1,
          },
        }));
      }
    } catch (error) {
      console.error(`${activeTab} 목록을 불러오는 중 오류 발생:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        onTabChange={handleTabChange}
        columns={columnsMap[activeTab] || columnsMap.review} // 탭에 따른 동적 컬럼
        data={postData[activeTab]?.list || []}
        currentPage={currentPage}
        totalPages={postData[activeTab]?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={[{ label: "최신순", value: "latest" }]}
        onRowClick={handleRowClick}
      />

      {/* 내 리뷰, 내 문의, 내 댓글 탭 모두 검색바 공유 가능 */}
      <div className="w-full max-w-xl mx-auto mt-2">
        <SearchBar
          options={postSearchOptions}
          onSearch={(searchType, keyword) => {
            setSearchQuery({ searchType, keyword });
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default MyPostPage;