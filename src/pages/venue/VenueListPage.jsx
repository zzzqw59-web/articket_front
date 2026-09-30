import { useEffect, useState } from "react";
import { getVenueList } from "../../api/venueApi";
import VenueSearch from "../../components/venue/VenueSearch";
import VenueList from "../../components/venue/VenueList";
import VenuePagination from "../../components/venue/VenuePagination";
import "../../styles/ExhibitionAndVenue.css";

const VenueListPage = () => {
  const [venues, setVenues] = useState([]);

  const [keyword, setKeyword] = useState("");

  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const size = 20;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getVenueList({
          keyword,
          sort,
          page,
          size,
        });

        setVenues(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("전시장 목록 조회 실패:", error);

        setError(
          "전시장 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [keyword, sort, page]);

  const handleSearch = (value) => {
    setKeyword(value);
    setPage(0);
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(0);
  };

  return (
    <div className="venue-list-page">
      <h1>전국 전시장 정보</h1>

      <VenueSearch
        onSearch={handleSearch}
      />

      <div className="venue-sort">
        <select
          value={sort}
          onChange={(e) =>
            handleSort(e.target.value)
          }
        >
          <option value="latest">
            최신순
          </option>

          <option value="oldest">
            오래된순
          </option>
        </select>
      </div>

      {loading && (
        <div>Loading...</div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <VenueList
            venues={venues}
          />

          <VenuePagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default VenueListPage;