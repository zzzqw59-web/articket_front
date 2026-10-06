import { useState } from "react";
import ActionButton from "../../../components/common/ActionButton";
import { useImageUploader } from "../../askpage/hooks/useImageUploader";
import ExhibitionSearchField from "../../askpage/components/ExhibitionSearchField";
import ImageUploadSection from "../../askpage/components/ImageUploadSection";

const REVIEW_IMAGE_LIMIT = 3;

const ReviewForm = ({
  initialData = null,
  isEditMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    selectedExhibition: initialData?.exhibitionId
      ? {
          id: initialData.exhibitionId,
          title: initialData.exhibitionTitle,
        }
      : null,
    title: initialData?.reviewTitle || "",
    content: initialData?.reviewBody || "",
  });

  const {
    existingImages,
    files,
    validFiles,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingImage,
  } = useImageUploader(
    REVIEW_IMAGE_LIMIT,
    initialData?.images || []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.selectedExhibition) {
      alert("관람한 전시를 선택해 주세요.");
      return;
    }

    if (!formData.title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("리뷰 내용을 입력해 주세요.");
      return;
    }

    const requestDto = {
      exhibitionId: formData.selectedExhibition.id,
      reviewTitle: formData.title,
      reviewBody: formData.content,
    };

    onSubmit({
      requestDto,
      files: validFiles,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4"
    >
      {/* 관련 전시 */}
      <ExhibitionSearchField
        isExhibitionCategory={true}
        selectedExhibition={formData.selectedExhibition}
        onSelectExhibition={(ex) =>
          setFormData((prev) => ({
            ...prev,
            selectedExhibition: ex,
          }))
        }
        onClearExhibition={() =>
          setFormData((prev) => ({
            ...prev,
            selectedExhibition: null,
          }))
        }
      />

      {/* 제목 */}
      <input
        type="text"
        name="title"
        placeholder="제목을 입력해 주세요"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-600"
      />

      {/* 내용 */}
      <textarea
        name="content"
        rows={10}
        placeholder="전시 관람 후기를 작성해 주세요"
        value={formData.content}
        onChange={handleChange}
        className="w-full p-3 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-600 resize-none"
      />

      {/* 이미지 */}
      <ImageUploadSection
        isEditMode={isEditMode}
        existingImages={existingImages}
        files={files}
        limit={REVIEW_IMAGE_LIMIT}
        onRemoveExisting={handleRemoveExistingImage}
        onRemoveNew={handleRemoveFile}
        onChangeFile={handleFileChange}
      />

      {/* 버튼 */}
      <div className="flex justify-end gap-2 mt-4">
        <ActionButton
          label={isEditMode ? "수정취소" : "작성취소"}
          variant="secondary"
          onClick={onCancel}
          type="button"
        />

        <ActionButton
          label={isEditMode ? "수정하기" : "등록하기"}
          variant="primary"
          type="submit"
        />
      </div>
    </form>
  );
};

export default ReviewForm;
