import { useState, useEffect } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";

const ExhibitionSearchInput = ({ onSelectExhibition }) => {
  const [keyword, setKeyword] = useState("");
  const [exhibitionList, setExhibitionList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    if (!keyword.trim() || keyword === selectedTitle) {
      setExhibitionList([]);
      setShowDropdown(false);
      return;
    }

    const fetchExhibitions = async () => {
      try {
        const data = await getExhibitionList({
          keyword: keyword,
          page: 0,
          size: 5,
        });
        const items = data.content || data.dtoList || data || [];
        setExhibitionList(items);
        setShowDropdown(true);
      } catch (error) {
        console.error("전시 검색 실패:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchExhibitions();
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, selectedTitle]);

  const handleSelectItem = (item) => {
    const title = item.title || item.exhibitionTitle;
    setSelectedTitle(title);
    setKeyword(title);
    setShowDropdown(false);
    onSelectExhibition(item); // 부모 컴포넌트로 선택된 전시 전달
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setSelectedTitle("");
        }}
        placeholder="연관 전시회를 검색하세요"
        className="w-full border p-2 rounded"
      />

      {showDropdown && exhibitionList.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
          {exhibitionList.map((item) => {
            const id = item.id || item.exhibitionId;
            const title = item.title || item.exhibitionTitle;
            return (
              <li
                key={id}
                onClick={() => handleSelectItem(item)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                [{id}] {title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ExhibitionSearchInput;