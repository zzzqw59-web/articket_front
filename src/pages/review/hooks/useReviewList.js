import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewList } from "../../../api/reviewApi";

export const useReviewList = () => {
  const navigate = useNavigate();

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

  return {
    currentPage,
    reviewList,
    totalPages,
    isLoading,
    setCurrentPage,
    handleSearch,
    handleRowClick,
  };
};