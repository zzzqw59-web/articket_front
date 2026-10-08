import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewDetail, updateReview } from "../../../api/reviewApi";
import { useModal } from "../../../hooks/useModal";

export const useReviewEdit = (reviewId) => {
  const navigate = useNavigate();

  const {
    modalState,
    showAlert,
    handleConfirm,
    handleCancel,
  } = useModal();

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 기존 리뷰 조회
  const fetchOriginalReview = useCallback(async () => {
    if (!reviewId) return;

    setIsLoading(true);

    try {
      const data = await getReviewDetail(reviewId);
      console.log("수정할 리뷰 데이터:", data);
      setInitialData(data);
    } catch (error) {
      console.error("원글 데이터 조회 실패:", error);

      showAlert({
        message: "존재하지 않거나 접근 권한이 없는 리뷰입니다.",
        onConfirm: () => navigate("/articket/review"),
      });
    } finally {
      setIsLoading(false);
    }
  }, [reviewId, navigate, showAlert]);

  useEffect(() => {
    fetchOriginalReview();
  }, [fetchOriginalReview]);

  // 리뷰 수정 제출
  const handleSubmit = async ({ requestDto, files = [], deletedImageIds = [] }) => {
    try {
      const formData = new FormData();

      formData.append("reviewTitle", requestDto.reviewTitle);
      formData.append("reviewBody", requestDto.reviewBody);

      files.forEach((file) => {
        formData.append("images", file);
      });

      deletedImageIds.forEach((imageId) => {
        formData.append("deleteImageIds", imageId);
      });

      await updateReview(reviewId, formData);

      showAlert({
        message: "리뷰가 성공적으로 수정되었습니다.",
        onConfirm: () => navigate(`/articket/review/${reviewId}`),
      });
    } catch (error) {
      console.error("리뷰 수정 실패:", error);

      const message =
        error.response?.data?.message ||
        "리뷰 수정 처리에 실패했습니다.";

      showAlert({
        message,
      });
    }
  };

  // 수정 취소
  const handleCancelEdit = () => {
    navigate(`/articket/review/${reviewId}`);
  };

  return {
    initialData,
    isLoading,
    handleSubmit,
    handleCancelEdit,
    modalState,
    handleConfirm,
    handleCancel,
  };
};