import { useState } from "react";
import "../../styles/ExhibitionAndVenue.css";

const ExhibitionSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch(keyword);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setKeyword(value);

    //검색어를 전부 지웠을 때만 전체 조회
    if(value === "") {
        onSearch("");
    }
  };

  return (
    <form
      className="exhibition-search"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={keyword}
        placeholder="전시명을 검색하세요"
        onChange={handleChange}
      />

      <button type="submit">
        검색
      </button>
    </form>
  );
};

export default ExhibitionSearch;