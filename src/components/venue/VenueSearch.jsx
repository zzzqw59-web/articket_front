import { useState } from "react";
import "../../styles/ExhibitionAndVenue.css";

const VenueSearch = ({ onSearch }) => {
  const [keyword, setKeyword] =useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch(keyword);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setKeyword(value);

    if(value === "") {
        onSearch("");
    }
  };

  return (
    <form
      className="venue-search"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={keyword}
        placeholder="전시장명을 검색하세요"
        onChange={handleChange}
      />

      <button type="submit">
        검색
      </button>
    </form>
  );
};

export default VenueSearch;