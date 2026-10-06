import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReviewDetail,
  deleteReview,
} from "../../../api/reviewApi";

import {
  getReviewReplyList,
  createReviewReply,
  updateReviewReply,
  deleteReviewReply,
} from "../../../api/reviewReplyApi";

export const useReviewDetail = (reviewId) => {
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [replyList, setReplyList] = useState([]);
  const [replyPage, setReplyPage] = useState(1);
  const [totalReplyPages, setTotalReplyPages] = useState(1);
  const [totalReplyCount, setTotalReplyCount] = useState(0);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // 리뷰 상세 조회
  useEffect(() => {
    const fetchReviewDetail = async () => {
      setIsLoading(true);

      try {
        const data = await getReviewDetail(reviewId);
        console.log("리뷰 상세:", data);
        setReviewData(data);
      } catch (error) {
        console.error("리뷰 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (reviewId) {
      fetchReviewDetail();
    }
  }, [reviewId]);

  // 리뷰 삭제
  const handleDeleteReview = async () => {
    const confirmed = window.confirm(
      "리뷰를 삭제하시겠습니까?\n삭제한 리뷰는 복구할 수 없습니다."
    );

    if (!confirmed) return;

    try {
      await deleteReview(reviewId);

      alert("리뷰가 성공적으로 삭제되었습니다.");
      navigate("/articket/review");
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);

      const message =
        error.response?.data?.message ||
        "리뷰 삭제 처리에 실패했습니다.";

      alert(message);
    }
  };

  // 댓글 목록 조회
  const fetchReplyList = useCallback(async () => {
    if (!reviewId) return;

    setIsReplyLoading(true);

    try {
      const response = await getReviewReplyList(
        reviewId,
        replyPage,
        10
      );

      if (response && response.dtoList) {
        const formattedReplies = response.dtoList.map((item) => ({
          id: item.reviewReplyId || item.id,
          writer: item.memberNickname || "익명",
          memberType: item.memberType,
          content: item.reviewReplyBody,

          createdAt: item.reviewReplyCreatedAt
            ? item.reviewReplyCreatedAt.replace("T", " ").slice(0, 16)
            : "",

          modifiedAt: item.reviewReplyModifiedAt
            ? item.reviewReplyModifiedAt.replace("T", " ").slice(0, 16)
            : "",

          rawItem: item,
        }));

        setReplyList(formattedReplies);
        setTotalReplyPages(response.totalPage || 1);
        setTotalReplyCount(response.totalCount || 0);
      }
    } catch (error) {
      console.error("리뷰 댓글 목록 로딩 실패:", error);
    } finally {
      setIsReplyLoading(false);
    }
  }, [reviewId, replyPage]);

  const handleAddComment = async (commentText) => {
    if (!commentText.trim()) return;

    try {
      await createReviewReply(reviewId, commentText);
      await fetchReplyList();
    } catch (error) {
      console.error("리뷰 댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleEditComment = async (reviewReplyId, commentText) => {
    if (!commentText.trim()) return;

    try {
      await updateReviewReply(
        reviewId,
        reviewReplyId,
        commentText
      );

      await fetchReplyList();
    } catch (error) {
      console.error("리뷰 댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (reviewReplyId) => {
    try {
      await deleteReviewReply(reviewId, reviewReplyId);
      await fetchReplyList();
    } catch (error) {
      console.error("리뷰 댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 페이지가 바뀌면 다시 조회
  useEffect(() => {
    fetchReplyList();
  }, [fetchReplyList]);

  return {
    reviewData,
    isLoading,
    replyList,
    replyPage,
    totalReplyPages,
    totalReplyCount,
    isReplyLoading,
    setReplyPage,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleDeleteReview,
  };
};