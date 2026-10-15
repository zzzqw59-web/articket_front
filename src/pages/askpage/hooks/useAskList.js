// src/hooks/ask/useAskList.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAskList } from "../../../api/askApi";
import { useModal } from "../../../hooks/useModal"; // 👈 모달 훅 임포트
import { getStoredAccessToken } from "../../../api/authStorage"; // 👈 토큰 확인 유틸 임포트

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
  const { modalState, showAlert, handleConfirm, handleCancel } = useModal(); // 👈 모달 상태 선언

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

  // 💡 [수정] 글쓰기 버튼 클릭 시 로그인 검증 및 ConfirmModal 안내 처리
  const handleWriteClick = () => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      const currentPath = window.location.pathname + window.location.search;
      showAlert({
        message: "로그인이 필요한 서비스입니다.",
        onConfirm: () => {
          navigate(`/articket/login?redirect=${encodeURIComponent(currentPath)}`);
        },
      });
      return;
    }

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
    // 💡 UI(AskListPage)에서 모달을 렌더링할 수 있도록 전달
    modalState,
    handleConfirm,
    handleCancel,
  };
};