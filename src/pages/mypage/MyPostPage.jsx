import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import { getMyAskList, getMyReviewList, getMyReplyList } from "../../api/mypageApi"; // 👈 getMyReplyList 추가

const MyPostPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("review");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState({ searchType: "title", keyword: "" });

  // 1. 탭별 통합 데이터 상태 관리
  const [postData, setPostData] = useState({
    review: { list: [], totalPages: 1 },
    ask: { list: [], totalPages: 1 },
    reply: { list: [], totalPages: 1 },
  });

  const [isLoading, setIsLoading] = useState(false);

  // 탭 목록 설정
  const tabs = [
    { id: "review", label: "내 리뷰" },
    { id: "ask", label: "내 문의" },
    { id: "reply", label: "내 댓글" },
  ];

  // 2. 탭별 테이블 컬럼 설정 (요구사항 반영: 내 댓글은 번호 / 댓글 내용 / 작성일)
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
      { key: "id", label: "번호", width: "w-24", align: "center" },
      { key: "replyContent", label: "댓글 내용", align: "left" },
      { key: "createdAt", label: "작성일", width: "w-32", align: "center" },
    ],
  };

  // 탭별 검색 옵션 설정 (댓글 탭은 내용 중심 검색)
  const getSearchOptions = () => {
    if (activeTab === "reply") {
      return [{ label: "내용", value: "content" }];
    }
    return [
      { label: "제목", value: "title" },
      { label: "내용", value: "content" },
    ];
  };

  // 탭 변경 처리
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchQuery({
      searchType: tabId === "reply" ? "content" : "title",
      keyword: "",
    });
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
        // MYPOST-001: 내 댓글 목록 연동
        response = await getMyReplyList(
          currentPage,
          10,
          searchQuery.searchType,
          searchQuery.keyword
        );
        formattedList = (response.dtoList || []).map((item) => {
          // 수정일이 작성일보다 이후면 수정일 표기, 아니면 작성일 표기
          const displayDate = item.displayDate || item.replyModifiedAt || item.replyCreatedAt;

          return {
            id: item.replyId,
            replyContent: item.replyContent,
            createdAt: displayDate ? displayDate.substring(0, 10) : "",
            // replyType ("REVIEW" 또는 "ASK")에 따라 원글 상세 URL 처리
            targetUrl: item.replyType === "REVIEW"
              ? `/articket/review/${item.targetId}`
              : `/articket/ask/${item.targetId}`,
          };
        });
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
        columns={columnsMap[activeTab] || columnsMap.review}
        data={postData[activeTab]?.list || []}
        currentPage={currentPage}
        totalPages={postData[activeTab]?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={[{ label: "최신순", value: "latest" }]}
        onRowClick={handleRowClick}
      />

      {/* 검색 바 */}
      <div className="w-full max-w-xl mx-auto mt-2">
        <SearchBar
          options={getSearchOptions()}
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