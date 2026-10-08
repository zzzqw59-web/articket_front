import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ReviewForm from "./components/ReviewForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useReviewEdit } from "./hooks/useReviewEdit";

const ReviewEditPage = () => {
  const { reviewId } = useParams();

  const {
    initialData,
    isLoading,
    handleSubmit,
    handleCancelEdit,
    modalState,
    handleConfirm,
    handleCancel,
  } = useReviewEdit(reviewId);

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
          title="리뷰 수정"
          description="관람한 전시의 리뷰를 수정해주세요."
        />

        <ReviewForm
          initialData={initialData}
          isEditMode={true}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
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

export default ReviewEditPage;