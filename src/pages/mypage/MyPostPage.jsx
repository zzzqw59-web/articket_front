import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import { getMyAskList, getMyReviewList, getMyReplyList } from "../../api/mypageApi";
import {
  MYPOST_TABS,
  MYPOST_SORT_OPTIONS,
  MYPOST_COLUMNS_MAP,
  getMyPostSearchOptions,
} from "../../constants/mypageConstants";

const MyPostPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("review");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const [postData, setPostData] = useState({
    review: { list: [], totalPages: 1 },
    ask: { list: [], totalPages: 1 },
    reply: { list: [], totalPages: 1 },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchType(tabId === "reply" ? "content" : "title");
    setKeyword("");
  };

  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
    setCurrentPage(1);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let response = null;
      let formattedList = [];
      const apiSortParam = sortOrder === "oldest" ? "asc" : "desc";

      if (activeTab === "review") {
        response = await getMyReviewList(currentPage, 10, searchType, keyword, apiSortParam);
        formattedList = (response.dtoList || []).map((item) => ({
          id: item.reviewId,
          title: item.reviewTitle,
          createdAt: item.reviewCreatedAt ? item.reviewCreatedAt.substring(0, 10) : "",
          targetUrl: `/articket/review/${item.reviewId}`,
        }));
      } else if (activeTab === "ask") {
        response = await getMyAskList(currentPage, 10, searchType, keyword, apiSortParam);
        formattedList = (response.dtoList || []).map((item) => ({
          id: item.askId,
          title: item.askTitle,
          createdAt: item.askCreatedAt ? item.askCreatedAt.substring(0, 10) : "",
          targetUrl: `/articket/ask/${item.askId}`,
        }));
      } else if (activeTab === "reply") {
        response = await getMyReplyList(currentPage, 10, searchType, keyword, apiSortParam);
        formattedList = (response.dtoList || []).map((item) => {
          const displayDate = item.displayDate || item.replyModifiedAt || item.replyCreatedAt;
          return {
            id: item.replyId,
            replyContent: item.replyContent,
            createdAt: displayDate ? displayDate.substring(0, 10) : "",
            targetUrl: item.replyType === "REVIEW" ? `/articket/review/${item.targetId}` : `/articket/ask/${item.targetId}`,
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
  }, [activeTab, currentPage, searchType, keyword, sortOrder]);

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
        tabs={MYPOST_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        columns={MYPOST_COLUMNS_MAP[activeTab] || MYPOST_COLUMNS_MAP.review}
        data={postData[activeTab]?.list || []}
        currentPage={currentPage}
        totalPages={postData[activeTab]?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        sortOptions={MYPOST_SORT_OPTIONS}
        currentSort={sortOrder}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
      />

      {/* 검색 바 */}
      <div className="w-full max-w-xl mx-auto mt-2">
        <SearchBar
          key={activeTab}
          options={getMyPostSearchOptions(activeTab)}
          onSearch={({ type, keyword }) => {
            setSearchType(type || (activeTab === "reply" ? "content" : "title"));
            setKeyword(keyword || "");
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default MyPostPage;