import React, { useState, useEffect } from "react";

const SearchBar = ({ options = [], onSearch, placeholder = "검색어를 입력하세요" }) => {
  // options의 첫 번째 항목 값으로 초기화 (options가 뒤늦게 전달되더라도 대응되도록 useEffect 포함)
  const [selectedType, setSelectedType] = useState(options[0]?.value || "");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (options.length > 0 && !selectedType) {
      setSelectedType(options[0].value);
    }
  }, [options, selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      // 🚀 { key, value } 대신 useAskList / AskListPage가 받는 { type, keyword }로 전달
      onSearch({ type: selectedType, keyword: keyword.trim() });
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm focus-within:border-amber-600 transition-colors"
    >
      {/* 검색 카테고리 셀렉트 */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="bg-transparent border-none outline-none text-gray-700 cursor-pointer pr-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="text-gray-300">|</span>

      {/* 검색어 입력창 */}
      <input
        type="text"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="bg-transparent border-none outline-none flex-1 text-gray-800 placeholder-gray-400"
      />

      {/* 검색 아이콘 버튼 */}
      <button type="submit" className="text-gray-500 hover:text-amber-800 p-1 transition-colors">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;