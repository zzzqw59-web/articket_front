import { useNavigate } from "react-router-dom";
import { createReview } from "../../../api/reviewApi";
import { useModal } from "../../../hooks/useModal";

export const useReviewWrite = () => {
  const navigate = useNavigate();

  const {
    modalState,
    showAlert,
    showConfirm,
    handleConfirm,
    handleCancel,
  } = useModal();

  // 리뷰 등록
  const handleSubmit = async ({ requestDto, files }) => {
    try {
      const formData = new FormData();

      // 리뷰 정보
      formData.append("exhibitionId", requestDto.exhibitionId);
      formData.append("reviewTitle", requestDto.reviewTitle);
      formData.append("reviewBody", requestDto.reviewBody);

      // 이미지 파일
      files.forEach((file) => {
        formData.append("images", file);
      });

      await createReview(formData);

      showAlert({
        message: "리뷰가 성공적으로 등록되었습니다.",
        onConfirm: () => navigate("/articket/review"),
      });
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      showAlert({
        message: "리뷰 등록에 실패했습니다.",
      });
    }
  };

  // 작성 취소
  const handleCancelWrite = () => {
    showConfirm({
      title: "작성 취소",
      message: "작성을 취소하시겠습니까?\n입력한 내용은 저장되지 않습니다.",
      confirmLabel: "확인",
      cancelLabel: "취소",
      onConfirm: () => navigate("/articket/review"),
    });
  };

  return {
    handleSubmit,
    handleCancelWrite,
    modalState,
    handleConfirm,
    handleCancel,
  };
};
