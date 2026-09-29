import { useState, useEffect, useRef } from "react";
import ActionButton from "../../../components/common/ActionButton";
import { useImageUploader } from "../hooks/useImageUploader";
import {
  ASK_IMAGE_LIMIT,
  CATEGORY_MAP,
  REVERSE_CATEGORY_MAP,
  ASK_CATEGORY_OPTIONS,
} from "../../../constants/askConstants";

// 샘플 전시회 목록 (추후 전시 검색 API 연동 가능)
const mockExhibitions = [
  { id: 148, title: "사라지는 것들에 대하여" },
  { id: 149, title: "사계절을 전시에 담다" },
  { id: 150, title: "인상주의 특별전" },
  { id: 151, title: "현대 미술의 거장들" },
];

const AskForm = ({
  initialData = null,
  isEditMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    category: "",
    selectedExhibition: null,
    title: "",
    isSecret: false,
    content: "",
    agreePolicy: false,
  });

  // 📸 이미지 제어 커스텀 훅 적용 (상수 ASK_IMAGE_LIMIT 사용)
  const {
    existingImages,
    files,
    validFiles,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingImage,
  } = useImageUploader(ASK_IMAGE_LIMIT, initialData?.images || []);

  // 검색 드롭다운 state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isExhibitionCategory = formData.category === "전시 관련 문의";

  // 기존 초기 데이터 채우기 (수정 모드)
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

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category,
      selectedExhibition: category === "전시 관련 문의" ? prev.selectedExhibition : null,
    }));
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 전시회 선택/취소
  const handleSelectExhibition = (exhibition) => {
    setFormData((prev) => ({ ...prev, selectedExhibition: exhibition }));
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleClearExhibition = () => {
    setFormData((prev) => ({ ...prev, selectedExhibition: null }));
    setSearchQuery("");
  };

  const filteredExhibitions = mockExhibitions.filter((ex) =>
    ex.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category) return alert("문의 종류를 선택해 주세요.");
    if (!formData.title.trim()) return alert("제목을 입력해 주세요.");
    if (!formData.content.trim()) return alert("문의 내용을 입력해 주세요.");
    if (!formData.agreePolicy) return alert("운영원칙 동의에 체크해 주세요.");

    // 백엔드 전달용 DTO 객체 조립 (중앙 상수 CATEGORY_MAP 사용)
    const requestDto = {
      exhibitionId: formData.selectedExhibition ? formData.selectedExhibition.id : null,
      askTitle: formData.title,
      askBody: formData.content,
      askType: CATEGORY_MAP[formData.category] ?? 0,
      askSecret: formData.isSecret ? 1 : 0,
    };

    if (isEditMode) {
      // 수정 모드일 때는 유지할 기존 이미지 파일명 배열 추가
      const keepImageFilenames = existingImages
        .map((img) => img.askImageFilename || img.filename)
        .filter(Boolean);

      onSubmit({
        requestDto: { ...requestDto, keepImageFilenames },
        newFiles: validFiles,
      });
    } else {
      // 작성 모드
      onSubmit({
        requestDto,
        files: validFiles,
      });
    }
  };

  return (
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

        <div className="md:col-span-2 relative" ref={dropdownRef}>
          {formData.selectedExhibition ? (
            <div className="flex items-center justify-between w-full px-3 py-2 text-sm border border-amber-300 bg-amber-50/50 rounded text-amber-900 font-medium">
              <span className="truncate">
                [{formData.selectedExhibition.id}] {formData.selectedExhibition.title}
              </span>
              <button
                type="button"
                onClick={handleClearExhibition}
                className="text-gray-400 hover:text-red-500 font-bold ml-2 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder={
                  isExhibitionCategory
                    ? "연관 전시회 검색 (예: 사라지는 것들에 대하여)"
                    : "문의 종류를 '전시 관련 문의'로 선택 시 검색 가능합니다"
                }
                value={searchQuery}
                disabled={!isExhibitionCategory}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => isExhibitionCategory && setIsDropdownOpen(true)}
                className={`w-full px-3 py-2 text-sm border rounded transition-colors focus:outline-none ${
                  isExhibitionCategory
                    ? "border-gray-300 bg-white focus:border-amber-600"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              />

              {isExhibitionCategory && isDropdownOpen && searchQuery.trim() !== "" && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto text-sm">
                  {filteredExhibitions.length > 0 ? (
                    filteredExhibitions.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleSelectExhibition(ex)}
                        className="w-full text-left px-4 py-2 hover:bg-amber-50 hover:text-amber-900 border-b last:border-none border-gray-100"
                      >
                        <span className="text-xs text-gray-400 mr-2">[{ex.id}]</span>
                        {ex.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-400 text-xs text-center">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
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

      {/* 수정 모드 전용: 기존 첨부 이미지 유지 목록 */}
      {isEditMode && existingImages.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
          <span className="text-xs text-gray-500 font-semibold">기존 첨부 이미지</span>
          <div className="flex gap-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-1 border border-gray-300 rounded bg-amber-50 text-xs text-gray-700">
                <span className="truncate max-w-[150px]">{img.askImageOrigin || `이미지 ${idx + 1}`}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(idx)}
                  className="text-gray-400 hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4행: 사진 첨부 영역 (상수 ASK_IMAGE_LIMIT 사용) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500 font-semibold">
          사진 첨부 (최대 {ASK_IMAGE_LIMIT}개)
        </span>
        {files.map((file, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {file ? (
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-gray-50 text-xs text-gray-700">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="text-gray-400 hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <span className="px-3 py-1.5 border border-gray-300 rounded bg-gray-100 text-xs text-gray-700 hover:bg-gray-200 inline-block">
                  사진 첨부하기 #{idx + 1}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(idx, e)}
                />
              </label>
            )}
          </div>
        ))}
      </div>

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
  );
};

export default AskForm;