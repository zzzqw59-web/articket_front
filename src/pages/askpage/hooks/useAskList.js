import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAskList } from "../../../api/askApi";

export const useAskList = (showAlert) => {
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

  // API 호출 함수 (getAskList 내부에서 axiosInstance를 통해 JWT 토큰 자동 전달)
  const fetchAskList = useCallback(async () => {
    setIsLoading(true);
    try {
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

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    setCurrentPage(1);
  };

  const handleSearch = ({ type, keyword }) => {
    setSearchParams({ searchType: type, keyword });
    setCurrentPage(1);
  };

  const handleRowClick = (row) => {
    navigate(`/articket/ask/${row.id}`);
  };

  const handleWriteClick = () => {
    // 💡 JWT 인증 기반 비로그인 상태 체크 (accessToken 존재 여부로 확인)
    const token = localStorage.getItem("accessToken");

    if (!token) {
      if (showAlert) {
        showAlert({
          title: "로그인 필요",
          message:
            "문의글을 작성하려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?",
          onConfirm: () => navigate("/articket/login"),
        });
      } else if (
        window.confirm(
          "문의글을 작성하려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/articket/login");
      }
      return;
    }

    // 로그인된 회원은 정상적으로 글쓰기 페이지로 이동
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
    setSelectedSort: handleSortChange,
    handleTabChange,
    handleSearch,
    handleRowClick,
    handleWriteClick,
  };
};