import React from "react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import AskForm from "./components/AskForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAskWrite } from "./hooks/useAskWrite";

const AskWritePage = () => {
  // 🚀 커스텀 훅을 통해 등록/취소 비즈니스 로직 및 모달 상태 바인딩
  const {
    handleSubmit,
    handleCancelWrite,
    modalState,
    handleConfirm,
    handleCancel,
  } = useAskWrite();

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />
        <AskForm
          isEditMode={false}
          onSubmit={handleSubmit}
          onCancel={handleCancelWrite}
        />
      </div>

      {/* 🚀 커스텀 모달 컴포넌트 바인딩 */}
      <ConfirmModal
        modalState={modalState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </MainLayout>
  );
};

export default AskWritePage;