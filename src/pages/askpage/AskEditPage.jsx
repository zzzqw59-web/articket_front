import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import AskForm from "./components/AskForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAskEdit } from "./hooks/useAskEdit";

const AskEditPage = () => {
  const { askId } = useParams();

  // 🚀 커스텀 훅을 통해 비즈니스 로직 및 모달 상태 제어
  const {
    initialData,
    isLoading,
    handleSubmit,
    handleCancelEdit,
    modalState,
    handleConfirm,
    handleCancel,
  } = useAskEdit(askId);

  if (isLoading) {
    return (
      <div>
        <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
          데이터를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />
        <AskForm
          initialData={initialData}
          isEditMode={true}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      </div>

      {/* 🚀 커스텀 모달 바인딩 */}
      <ConfirmModal
        modalState={modalState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AskEditPage;