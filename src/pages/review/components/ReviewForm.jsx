import { useState, useEffect } from "react";
import ActionButton from "../../../components/common/ActionButton";
import { useImageUploader } from "../../askpage/hooks/useImageUploader";
import ImageUploadSection from "../../askpage/components/ImageUploadSection";
import { getAvailableExhibitionsForReview } from "../../../api/reviewApi";

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

  const [exhibitions, setExhibitions] = useState([]);

  // 작성 모드에서만 리뷰 작성 가능한 전시 조회
  useEffect(() => {
    if (isEditMode) {
      return;
    }

    const fetchExhibitions = async () => {
      try {
        const data = await getAvailableExhibitionsForReview();

        console.log("리뷰 작성 가능한 전시:", data);

        setExhibitions(data);
      } catch (error) {
        console.error("리뷰 작성 가능한 전시 조회 실패:", error);
      }
    };

    fetchExhibitions();
  }, [isEditMode]);

  const {
    existingImages,
    deletedImageIds,
    files,
    validFiles,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingImage,
  } = useImageUploader(
    REVIEW_IMAGE_LIMIT,
    initialData?.images || []
  );

  // 제목 / 내용 변경
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 작성 모드에서 전시 선택
  const handleExhibitionChange = (e) => {
    const exhibitionId = Number(e.target.value);

    const selected = exhibitions.find(
      (exhibition) =>
        exhibition.exhibitionId === exhibitionId
    );

    setFormData((prev) => ({
      ...prev,
      selectedExhibition: selected
        ? {
            id: selected.exhibitionId,
            title: selected.exhibitionTitle,
          }
        : null,
    }));
  };

  // 등록 / 수정
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
      deletedImageIds,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4"
    >
      {/* 전시 */}
      {isEditMode ? (
        // 수정 모드에서는 기존 전시 고정
        <input
          type="text"
          value={formData.selectedExhibition?.title || ""}
          disabled
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 text-gray-700"
        />
      ) : (
        // 작성 모드에서는 관람한 전시 선택
        <select
          value={formData.selectedExhibition?.id || ""}
          onChange={handleExhibitionChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
        >
          <option value="">
            관람한 전시를 선택해 주세요
          </option>

          {exhibitions.map((exhibition) => (
            <option
              key={exhibition.exhibitionId}
              value={exhibition.exhibitionId}
            >
              {exhibition.exhibitionTitle}
            </option>
          ))}
        </select>
      )}

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
