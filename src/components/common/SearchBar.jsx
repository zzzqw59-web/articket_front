import React, { useState } from "react";

const SearchBar = ({ options = [], onSearch }) => {
  const [selectedKey, setSelectedKey] = useState(options[0]?.value || "");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ key: selectedKey, value: searchValue });
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm"
    >
      {/* 검색 카테고리 셀렉트 */}
      <select
        value={selectedKey}
        onChange={(e) => setSelectedKey(e.target.value)}
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
        placeholder="Value"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="bg-transparent border-none outline-none flex-1 text-gray-800 placeholder-gray-400"
      />

      {/* 검색 아이콘 버튼 */}
      <button type="submit" className="text-gray-500 hover:text-gray-800 p-1">
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