import { useNavigate } from "react-router-dom";
import { createAsk } from "../../../api/askApi";
import { useModal } from "../../../hooks/useModal";

export const useAskWrite = () => {
  const navigate = useNavigate();
  const { modalState, showAlert, showConfirm, handleConfirm, handleCancel } =
    useModal();

  // 문의 등록 제출 핸들러
  const handleSubmit = async ({ requestDto, files }) => {
    try {
      const askId = await createAsk(requestDto, files);
      showAlert({
        message: "문의가 성공적으로 등록되었습니다.",
        onConfirm: () => navigate(`/articket/ask/${askId}`),
      });
    } catch (error) {
      console.error("문의 등록 실패:", error);
      showAlert({ message: "문의 등록에 실패했습니다." });
    }
  };

  // 작성 취소 핸들러
  const handleCancelWrite = () => {
    showConfirm({
      title: "작성 취소",
      message: "작성을 취소하시겠습니까?\n입력한 내용은 저장되지 않습니다.",
      confirmLabel: "확인",
      cancelLabel: "취소",
      onConfirm: () => navigate("/articket/ask"),
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