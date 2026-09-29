import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAskList } from "../../../api/askApi";

export const useAskList = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState("latest");
  const [searchParams, setSearchParams] = useState({
    searchType: "",
    keyword: "",
  });

  const [askList, setAskList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // API 호출 함수
  const fetchAskList = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 10,
        sort: selectedSort,
        ...(activeTab !== "all" && { askType: parseInt(activeTab, 10) }),
        // 💡 keyword가 존재할 때만 searchType과 keyword 전송
        ...(searchParams.keyword && {
          searchType: searchParams.searchType,
          keyword: searchParams.keyword,
        }),
      };

      console.log("📢 API 전송 파라미터:", params); // Console에서 전송되는 값 확인용

      const response = await getAskList(params);

      if (response && response.dtoList) {
        const formattedData = response.dtoList.map((item) => ({
          id: item.askId,
          title: `${item.askSecret === 1 ? "🔒 " : ""}${item.askTitle}${
            item.replyCount > 0 ? ` [${item.replyCount}]` : ""
          }${item.hasImage ? " 📎" : ""}`,
          writer: item.memberNickname || "익명",
          createdAt: item.askCreatedAt ? item.askCreatedAt.split(" ")[0] : "",
          views: item.askHits ?? 0,
          rawItem: item,
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

  useEffect(() => {
    fetchAskList();
  }, [fetchAskList]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  // 🚀 검색 실행 시 파라미터 수신 및 페이지 1로 리셋
  const handleSearch = ({ type, keyword }) => {
    console.log("🔎 검색 이벤트 수신:", { type, keyword });
    setSearchParams({ searchType: type, keyword });
    setCurrentPage(1);
  };

  const handleRowClick = (row) => {
    navigate(`/articket/ask/${row.id}`);
  };

  const handleWriteClick = () => {
    navigate("/articket/ask/write");
  };

  return {
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
  };
};