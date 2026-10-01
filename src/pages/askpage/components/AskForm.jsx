import { useState, useEffect } from "react";
import ActionButton from "../../../components/common/ActionButton";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { useModal } from "../../../hooks/useModal";
import { useImageUploader } from "../hooks/useImageUploader";
import ExhibitionSearchField from "../components/ExhibitionSearchField";
import ImageUploadSection from "../components/ImageUploadSection";

import {
  ASK_IMAGE_LIMIT,
  CATEGORY_MAP,
  REVERSE_CATEGORY_MAP,
  ASK_CATEGORY_OPTIONS,
} from "../../../constants/askConstants";

const AskForm = ({
  initialData = null,
  isEditMode = false,
  onSubmit,
  onCancel,
}) => {
  const { modalState, showAlert, handleConfirm, handleCancel } = useModal();

  const [formData, setFormData] = useState({
    category: "",
    selectedExhibition: null,
    title: "",
    isSecret: false,
    content: "",
    agreePolicy: false,
  });

  const {
    existingImages,
    files,
    validFiles,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingImage,
  } = useImageUploader(ASK_IMAGE_LIMIT, initialData?.images || []);

  const isExhibitionCategory = formData.category === "전시 관련 문의";

  // 초기 데이터 채우기 (수정 모드)
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        category: REVERSE_CATEGORY_MAP[initialData.askType] || "기타",
        selectedExhibition: initialData.exhibitionTitle
          ? { id: initialData.exhibitionId, title: initialData.exhibitionTitle }
          : null,
        title: initialData.askTitle || "",
        isSecret: initialData.askSecret === 1,
        content: initialData.askBody || "",
        agreePolicy: true,
      });
    }
  }, [isEditMode, initialData]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category,
      selectedExhibition: category === "전시 관련 문의" ? prev.selectedExhibition : null,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /// 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category) return showAlert({ message: "문의 종류를 선택해 주세요." });
    if (!formData.title.trim()) return showAlert({ message: "제목을 입력해 주세요." });
    if (!formData.content.trim()) return showAlert({ message: "문의 내용을 입력해 주세요." });
    if (!formData.agreePolicy) return showAlert({ message: "운영원칙 동의에 체크해 주세요." });

    const requestDto = {
      exhibitionId: formData.selectedExhibition ? formData.selectedExhibition.id : null,
      askTitle: formData.title,
      askBody: formData.content,
      askType: CATEGORY_MAP[formData.category] ?? 0,
      askSecret: formData.isSecret ? 1 : 0,
    };

    if (isEditMode) {
      // 💡 1. existingImages를 askImageOrder 순서대로 오름차순 정렬 (기존 파일 우선 순위 보장)
      const sortedExistingImages = [...existingImages].sort((a, b) => {
        const orderA = a.askImageOrder ?? 0;
        const orderB = b.askImageOrder ?? 0;
        return orderA - orderB;
      });

      // 💡 2. URL 및 다양한 파일명 속성 대응하여 순수 파일명(UUID_파일명.ext)만 정확히 추출
      const keepImageFilenames = sortedExistingImages
        .map((img) => {
          if (img.imageUrl) {
            // URL의 마지막 경로(파일명) 추출 및 쿼리스트링 제거
            const filenameFromUrl = img.imageUrl.split("/").pop().split("?")[0];
            return filenameFromUrl;
          }
          return img.askImageFilename || img.filename || img.fileName || img.savedFilename;
        })
        .filter(Boolean);

      console.log("🚀 최종 정렬되어 전송될 keepImageFilenames:", keepImageFilenames);

      onSubmit({
        requestDto: { ...requestDto, keepImageFilenames },
        newFiles: validFiles,
      });
    } else {
      // 💡 [수정] 작성 모드일 때도 정상적으로 onSubmit을 호출하도록 분기 추가!
      onSubmit({
        requestDto,
        files: validFiles,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* 1행: 문의 종류 + 연관 전시회 검색 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:border-amber-600"
          >
            <option value="">문의 종류 선택</option>
            {ASK_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="md:col-span-2">
            <ExhibitionSearchField
              isExhibitionCategory={isExhibitionCategory}
              selectedExhibition={formData.selectedExhibition}
              onSelectExhibition={(ex) => setFormData((prev) => ({ ...prev, selectedExhibition: ex }))}
              onClearExhibition={() => setFormData((prev) => ({ ...prev, selectedExhibition: null }))}
            />
          </div>
        </div>

        {/* 2행: 제목 + 비밀글 체크 */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            name="title"
            placeholder="제목을 입력해 주세요"
            value={formData.title}
            onChange={handleChange}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-600"
          />
          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              name="isSecret"
              checked={formData.isSecret}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-600 rounded"
            />
            비밀글
          </label>
        </div>

        {/* 3행: 문의 내용 */}
        <textarea
          name="content"
          rows={10}
          placeholder="문의 내용을 입력해 주세요"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-3 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-600 resize-none"
        />

        {/* 4행: 이미지 업로드 섹션 컴포넌트 재사용 */}
        <ImageUploadSection
          isEditMode={isEditMode}
          existingImages={existingImages}
          files={files}
          limit={ASK_IMAGE_LIMIT}
          onRemoveExisting={handleRemoveExistingImage}
          onRemoveNew={handleRemoveFile}
          onChangeFile={handleFileChange}
        />

        {/* 5행: 운영원칙 동의 */}
        <div className="mt-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="agreePolicy"
              checked={formData.agreePolicy}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-600 rounded"
            />
            운영원칙에 위배되는 게시물은 삭제될 수 있습니다.
          </label>
        </div>

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

      <ConfirmModal
        modalState={modalState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default AskForm;