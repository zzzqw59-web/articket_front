import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAskDetail, updateAsk } from "../../../api/askApi";
import { useModal } from "../../../hooks/useModal";

export const useAskEdit = (askId) => {
  const navigate = useNavigate();
  const { modalState, showAlert, handleConfirm, handleCancel } = useModal();

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 원글 데이터 조회
  const fetchOriginalAsk = useCallback(async () => {
    if (!askId) return;
    setIsLoading(true);
    try {
      const data = await getAskDetail(askId);
      setInitialData(data);
    } catch (error) {
      console.error("원글 데이터 조회 실패:", error);
      showAlert({
        message: "존재하지 않거나 접근 권한이 없는 문의글입니다.",
        onConfirm: () => navigate("/articket/ask"),
      });
    } finally {
      setIsLoading(false);
    }
  }, [askId, navigate, showAlert]);

  useEffect(() => {
    fetchOriginalAsk();
  }, [fetchOriginalAsk]);

  // 문의글 수정 제출
  const handleSubmit = async ({ requestDto, newFiles }) => {
    try {
      await updateAsk(askId, requestDto, newFiles);
      showAlert({
        message: "문의글이 성공적으로 수정되었습니다.",
        onConfirm: () => navigate(`/articket/ask/${askId}`),
      });
    } catch (error) {
      console.error("문의글 수정 실패:", error);
      showAlert({ message: "문의글 수정 처리에 실패했습니다." });
    }
  };

  // 취소 처리
  const handleCancelEdit = () => {
    navigate(`/articket/ask/${askId}`);
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