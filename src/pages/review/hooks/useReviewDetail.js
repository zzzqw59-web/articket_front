import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewDetail, deleteReview } from "../../../api/reviewApi";

import {
  getReviewReplyList,
  createReviewReply,
  updateReviewReply,
  deleteReviewReply,
} from "../../../api/reviewReplyApi";

import { useModal } from "../../../hooks/useModal";

export const useReviewDetail = (reviewId) => {
  const navigate = useNavigate();

  const { modalState, showAlert, showConfirm, handleConfirm, handleCancel } =
    useModal();

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
        setReviewData(data);
      } catch (error) {
        showAlert({
          message: "리뷰 정보를 불러오지 못했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (reviewId) {
      fetchReviewDetail();
    }
  }, [reviewId, showAlert]);

  // 리뷰 삭제
  const handleDeleteReview = () => {
    showConfirm({
      message: "리뷰를 삭제하시겠습니까?\n삭제한 리뷰는 복구할 수 없습니다.",

      onConfirm: async () => {
        try {
          await deleteReview(reviewId);

          showAlert({
            message: "리뷰가 성공적으로 삭제되었습니다.",
            onConfirm: () => navigate("/articket/review"),
          });
        } catch (error) {
          const message =
            error.response?.data?.message || "리뷰 삭제 처리에 실패했습니다.";

          showAlert({
            message,
          });
        }
      },
    });
  };

  // 댓글 목록 조회
  const fetchReplyList = useCallback(async () => {
    if (!reviewId) return;

    setIsReplyLoading(true);

    try {
      const response = await getReviewReplyList(reviewId, replyPage, 10);

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
      showAlert({
        message: "댓글 목록을 불러오지 못했습니다.",
      });
    } finally {
      setIsReplyLoading(false);
    }
  }, [reviewId, replyPage, showAlert]);

  // 댓글 등록
  const handleAddComment = async (commentText) => {
    if (!commentText.trim()) return;

    try {
      await createReviewReply(reviewId, commentText);
      await fetchReplyList();
    } catch (error) {
      showAlert({
        message: "댓글 등록에 실패했습니다.",
      });
    }
  };

  // 댓글 수정
  const handleEditComment = async (reviewReplyId, commentText) => {
    if (!commentText.trim()) return;

    try {
      await updateReviewReply(reviewId, reviewReplyId, commentText);

      await fetchReplyList();
    } catch (error) {
      showAlert({
        message: "댓글 수정에 실패했습니다.",
      });
    }
  };

  // 댓글 삭제
  const handleDeleteComment = (reviewReplyId) => {
    showConfirm({
      message: "댓글을 삭제하시겠습니까?",

      onConfirm: async () => {
        try {
          await deleteReviewReply(reviewId, reviewReplyId);

          await fetchReplyList();
        } catch (error) {
          showAlert({
            message: "댓글 삭제에 실패했습니다.",
          });
        }
      },
    });
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

    // 모달
    modalState,
    handleConfirm,
    handleCancel,
  };
};
