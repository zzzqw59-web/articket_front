import { useState, useEffect } from "react";
import ActionButton from "../../../components/common/ActionButton";
import { useImageUploader } from "../../askpage/hooks/useImageUploader";
import ImageUploadSection from "../../askpage/components/ImageUploadSection";
import { getMyReservations } from "../../../api/reservationApi";

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

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getMyReservations();

        console.log("내 예약 목록:", data);

        setReservations(data.dtoList || []);
      } catch (error) {
        console.error("리뷰 등록 실패:", error);

        const message =
        error.response?.data?.message || "리뷰 등록에 실패했습니다.";

  showAlert({
    message,
  });
}
    };

    fetchReservations();
  }, []);

  // 리뷰 작성 가능한 예약만 필터링
  const availableReservations = reservations.filter((reservation) => {
    return (
      reservation.reservationStatus === "RESERVED" &&
      reservation.reservationDay <= new Date().toISOString().slice(0, 10)
    );
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
      {/* 관람한 전시 */}
      <select
        value={formData.selectedExhibition?.id || ""}
        onChange={(e) => {
          const selected = availableReservations.find(
            (reservation) =>
              reservation.exhibitionId === Number(e.target.value)
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
        }}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
      >
        <option value="">관람한 전시를 선택해 주세요</option>

        {availableReservations.map((reservation) => (
          <option
            key={reservation.reservationId}
            value={reservation.exhibitionId}
          >
            {reservation.exhibitionTitle} ({reservation.reservationDay})
          </option>
        ))}
      </select>

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