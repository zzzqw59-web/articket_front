import { useState, useCallback } from "react";

/**
 * 커스텀 모달(Confirm / Alert) 상태 관리 훅
 */
export const useModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "alert", // 'alert' | 'confirm'
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmLabel: "확인",
    cancelLabel: "취소",
  });

  // Alert 모달 열기
  const showAlert = useCallback(({ title = "안내", message, onConfirm }) => {
    setModalState({
      isOpen: true,
      type: "alert",
      title,
      message,
      onConfirm,
      onCancel: null,
      confirmLabel: "확인",
      cancelLabel: "취소",
    });
  }, []);

  // Confirm 모달 열기
  const showConfirm = useCallback(
    ({
      title = "확인",
      message,
      onConfirm,
      onCancel,
      confirmLabel = "확인",
      cancelLabel = "취소",
    }) => {
      setModalState({
        isOpen: true,
        type: "confirm",
        title,
        message,
        onConfirm,
        onCancel,
        confirmLabel,
        cancelLabel,
      });
    },
    []
  );

  // 모달 닫기
  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 확인 버튼 클릭 핸들러
  const handleConfirm = useCallback(() => {
    if (modalState.onConfirm) {
      modalState.onConfirm();
    }
    closeModal();
  }, [modalState, closeModal]);

  // 취소 버튼 클릭 핸들러
  const handleCancel = useCallback(() => {
    if (modalState.onCancel) {
      modalState.onCancel();
    }
    closeModal();
  }, [modalState, closeModal]);

  return {
    modalState,
    showAlert,
    showConfirm,
    closeModal,
    handleConfirm,
    handleCancel,
  };
};