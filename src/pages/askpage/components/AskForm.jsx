import React, { useState, useEffect, useRef } from "react";
import ActionButton from "../../../components/common/ActionButton";

// 샘플 전시회 검색 데이터 목록 (추후 API 연동)
const mockExhibitions = [
  { id: "0000148", title: "사라지는 것들에 대하여" },
  { id: "0000149", title: "사계절을 전시에 담다" },
  { id: "0000150", title: "인상주의 특별전" },
  { id: "0000151", title: "현대 미술의 거장들" },
];

const AskForm = ({
  initialData = {},
  isEditMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    category: initialData.category || "",
    selectedExhibition: initialData.exhibition || null, // 선택된 전시회 객체 { id, title } 또는 null
    title: initialData.title || "",
    isSecret: initialData.isSecret || false,
    content: initialData.content || "",
    agreePolicy: initialData.agreePolicy || false,
  });

  // 전시 검색 관련 state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 문의 종류가 '전시 관련 문의'인지 여부
  const isExhibitionCategory = formData.category === "전시 관련 문의";

  // 첨부 파일 상태
  const [files, setFiles] = useState([
    initialData.files?.[0] || null,
    initialData.files?.[1] || null,
    initialData.files?.[2] || null,
  ]);

  // 수정 모드 데이터 로드
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        category: initialData.category || "전시 관련 문의",
        selectedExhibition: initialData.exhibition
          ? { id: "0000148", title: initialData.exhibition }
          : null,
        title: initialData.title || "",
        isSecret: initialData.isSecret ?? false,
        content: initialData.content || "",
        agreePolicy: true,
      });
      if (initialData.files) {
        setFiles([
          initialData.files[0] || null,
          initialData.files[1] || null,
          initialData.files[2] || null,
        ]);
      }
    }
  }, [isEditMode, initialData]);

  // 드롭다운 외부 클릭 감지 및 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 문의 종류 변경 시 이벤트
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category,
      // '전시 관련 문의'가 아니면 선택된 연관 전시회도 초기화
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

  // 전시회 선택 처리
  const handleSelectExhibition = (exhibition) => {
    setFormData((prev) => ({
      ...prev,
      selectedExhibition: exhibition,
    }));
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  // 선택된 전시회 초기화 (X 버튼)
  const handleClearExhibition = () => {
    setFormData((prev) => ({
      ...prev,
      selectedExhibition: null,
    }));
    setSearchQuery("");
  };

  // 검색어 필터링된 전시회 목록
  const filteredExhibitions = mockExhibitions.filter((ex) =>
    ex.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("제목을 입력해주세요.");
    if (!formData.content.trim()) return alert("문의 내용을 입력해주세요.");
    if (!formData.agreePolicy) return alert("운영원칙에 동의해주세요.");

    if (onSubmit) {
      onSubmit({ ...formData, files });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {/* 1행: 문의 종류 + 연관 전시회 검색 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 문의 종류 선택 */}
        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:border-amber-600"
        >
          <option value="">문의 종류</option>
          <option value="전시 관련 문의">전시 관련 문의</option>
          <option value="사이트 관련 문의">사이트 관련 문의</option>
          <option value="기타">기타</option>
        </select>

        {/* 연관 전시회 검색 / 선택 영역 */}
        <div className="md:col-span-2 relative" ref={dropdownRef}>
          {/* A. 전시회가 이미 선택되어 있는 경우 */}
          {formData.selectedExhibition ? (
            <div className="flex items-center justify-between w-full px-3 py-2 text-sm border border-amber-300 bg-amber-50/50 rounded text-amber-900 font-medium">
              <span className="truncate">
                [{formData.selectedExhibition.id}] {formData.selectedExhibition.title}
              </span>
              <button
                type="button"
                onClick={handleClearExhibition}
                className="text-gray-400 hover:text-red-500 font-bold ml-2 transition-colors"
                title="선택 취소"
              >
                ✕
              </button>
            </div>
          ) : (
            /* B. 검색 입력창 영역 (문의 종류가 '전시 관련 문의'일 때만 활성화) */
            <>
              <input
                type="text"
                placeholder={
                  isExhibitionCategory
                    ? "연관 전시회 검색"
                    : "문의 종류를 '전시 관련 문의'로 선택 시 검색 가능합니다"
                }
                value={searchQuery}
                disabled={!isExhibitionCategory}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => isExhibitionCategory && setIsDropdownOpen(true)}
                className={`w-full px-3 py-2 pr-10 text-sm border rounded transition-colors focus:outline-none ${
                  isExhibitionCategory
                    ? "border-gray-300 bg-white focus:border-amber-600"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>

              {/* 검색 드롭다운 결과창 */}
              {isExhibitionCategory && isDropdownOpen && searchQuery.trim() !== "" && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto text-sm">
                  {filteredExhibitions.length > 0 ? (
                    filteredExhibitions.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleSelectExhibition(ex)}
                        className="w-full text-left px-4 py-2 hover:bg-amber-50 hover:text-amber-900 transition-colors border-b last:border-none border-gray-100"
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

      {/* 2행: 제목 + 비밀글 체크박스 */}
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
        placeholder="문의 내용을 입력해주세요"
        value={formData.content}
        onChange={handleChange}
        className="w-full p-3 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-600 resize-none"
      />

      {/* 4행: 사진 첨부 영역 (3개) */}
      <div className="flex flex-col gap-2">
        {files.map((file, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {file ? (
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-gray-50 text-xs text-gray-700">
                <span>{file}</span>
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
                  사진 첨부하기
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

      {/* 5행: 운영원칙 동의 체크박스 */}
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

      {/* 하단 취소 / 등록(수정) 버튼 */}
      <div className="flex justify-end gap-2 mt-4">
        <ActionButton
          label={isEditMode ? "수정취소" : "작성취소"}
          variant="secondary"
          onClick={onCancel}
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