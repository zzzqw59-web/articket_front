// src/pages/review/hooks/useReviewList.js (경로에 맞게 확인)
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewList } from "../../../api/reviewApi";
import { useModal } from "../../../hooks/useModal"; // 👈 모달 훅 임포트
import { getStoredAccessToken } from "../../../api/authStorage"; // 👈 토큰 확인 유틸 임포트

export const useReviewList = () => {
  const navigate = useNavigate();
  const { modalState, showAlert, handleConfirm, handleCancel } = useModal(); // 👈 모달 상태 선언

  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useState({
    searchType: "",
    keyword: "",
  });

  const [reviewList, setReviewList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviewList = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = {
        page: currentPage,
        size: 10,
        ...(searchParams.keyword && {
          searchType: searchParams.searchType,
          keyword: searchParams.keyword,
        }),
      };

      const response = await getReviewList(params);

      const rawList = response?.dtoList || [];

      const formattedList = rawList.map((item) => ({
        id: item.reviewId,
        title: item.reviewTitle,
        writer: item.memberNickname,
        createdAt: item.reviewCreatedAt
            ? item.reviewCreatedAt.replace("T", " ").slice(0, 16)
            : "",
        views: item.reviewHits ?? 0,
        rawItem: item,
      }));

      setReviewList(formattedList);
      setTotalPages(response?.totalPage || 1);
    } catch (error) {
      console.error("리뷰 목록 조회 실패:", error);
      setReviewList([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchParams]);

  useEffect(() => {
    fetchReviewList();
  }, [fetchReviewList]);

  const handleSearch = ({ type, keyword }) => {
    setSearchParams({
      searchType: type,
      keyword,
    });
    setCurrentPage(1);
  };

  const handleRowClick = (row) => {
    navigate(`/articket/review/${row.id}`);
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

    navigate("/articket/review/write");
  };

  return {
    currentPage,
    reviewList,
    totalPages,
    isLoading,
    setCurrentPage,
    handleSearch,
    handleRowClick,
    handleWriteClick, // 👈 컴포넌트로 전달
    // 💡 UI(ReviewPage)에서 모달을 렌더링할 수 있도록 전달
    modalState,
    handleConfirm,
    handleCancel,
  };
};