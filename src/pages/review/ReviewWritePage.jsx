import PageHeader from "../../components/common/PageHeader";
import ReviewForm from "./components/ReviewForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useReviewWrite } from "./hooks/useReviewWrite";

const ReviewWritePage = () => {
  const {
    handleSubmit,
    handleCancelWrite,
    modalState,
    handleConfirm,
    handleCancel,
  } = useReviewWrite();

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="리뷰 작성"
          description="전시를 관람한 후기를 자유롭게 남겨주세요."
        />

        <ReviewForm
          isEditMode={false}
          onSubmit={handleSubmit}
          onCancel={handleCancelWrite}
        />
      </div>

      <ConfirmModal
        modalState={modalState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ReviewWritePage;
