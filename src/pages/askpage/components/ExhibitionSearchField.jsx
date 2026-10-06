import { useState, useEffect, useRef } from "react";
import { getExhibitionSearchListForAsk } from "../../../api/askApi";
const ExhibitionSearchField = ({
  isExhibitionCategory,
  selectedExhibition,
  onSelectExhibition,
  onClearExhibition,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [exhibitionList, setExhibitionList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // 실시간 전시 검색 API 연동 (디바운스 적용)
  useEffect(() => {
    if (!isExhibitionCategory || !searchQuery.trim()) {
      setExhibitionList([]);
      return;
    }

    const fetchExhibitions = async () => {
      try {
        const data = await getExhibitionSearchListForAsk({
          keyword: searchQuery.trim(),
          page: 0,
          size: 5,
        });
        const items = data.content || data.dtoList || data || [];
        setExhibitionList(items);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("전시 검색 실패:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchExhibitions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isExhibitionCategory]);

  if (selectedExhibition) {
    return (
      <div className="flex items-center justify-between w-full px-3 py-2 text-sm border border-amber-300 bg-amber-50/50 rounded text-amber-900 font-medium">
        <span className="truncate">
          [{selectedExhibition.id}] {selectedExhibition.title}
        </span>
        <button
          type="button"
          onClick={onClearExhibition}
          className="text-gray-400 hover:text-red-500 font-bold ml-2 transition-colors"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder={
          isExhibitionCategory
            ? "연관 전시회 검색 (예: 사계절)"
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
          {exhibitionList.length > 0 ? (
            exhibitionList.map((ex) => {
              const exId = ex.id || ex.exhibitionId;
              const exTitle = ex.title || ex.exhibitionTitle;
              return (
                <button
                  key={exId}
                  type="button"
                  onClick={() => {
                    onSelectExhibition({ id: exId, title: exTitle });
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 hover:text-amber-900 border-b last:border-none border-gray-100"
                >
                  <span className="text-xs text-gray-400 mr-2">[{exId}]</span>
                  {exTitle}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 text-gray-400 text-xs text-center">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExhibitionSearchField;