// src/hooks/ask/useAskList.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAskList } from "../../../api/askApi";

/**
 * 문의글 제목 아이콘 및 포맷팅 헬퍼 함수
 */
const formatAskTitle = (item) => {
  const secretIcon = item.askSecret === 1 ? "🔒 " : "";
  const replyBadge = item.replyCount > 0 ? ` [${item.replyCount}]` : "";
  const fileIcon = item.hasImage ? " 📎" : "";

  return `${secretIcon}${item.askTitle}${replyBadge}${fileIcon}`;
};

export const useAskList = () => {
  const navigate = useNavigate();

  // 필터 및 페이징 상태
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState("latest");
  const [searchParams, setSearchParams] = useState({
    searchType: "",
    keyword: "",
  });

  // 데이터 리스트 및 로딩 상태
  const [askList, setAskList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // API 목록 조회 함수
  const fetchAskList = useCallback(async () => {
    setIsLoading(true);

    try {
      // API 요청 파라미터 구성
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

      // Page<DTO> (content) 및 PageResponseDTO (dtoList) 호환 처리
      const rawList = response?.content || response?.dtoList || [];
      const calculatedTotalPages = response?.totalPages || response?.totalPage || 1;

      const formattedList = rawList.map((item) => ({
        id: item.askId,
        title: formatAskTitle(item),
        writer: item.memberNickname || "익명",
        createdAt: item.askCreatedAt ? item.askCreatedAt.split(" ")[0] : "",
        views: item.askHits ?? 0,
        rawItem: item,
      }));

      setAskList(formattedList);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error("문의 목록 조회 실패:", error);
      setAskList([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeTab, selectedSort, searchParams]);

  // 의존성 변경 시 데이터 자동 조회
  useEffect(() => {
    fetchAskList();
  }, [fetchAskList]);

  // 이벤트 핸들러 모음
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

  // 문의글 작성 페이지 이동 (인증 가드는 ProtectedRoute가 전담)
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
    setSelectedSort: handleSortChange,
    handleTabChange,
    handleSearch,
    handleRowClick,
    handleWriteClick,
  };
};