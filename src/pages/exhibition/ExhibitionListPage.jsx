import { useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import ExhibitionSearch from "../../components/exhibition/ExhibitionSearch";
import ExhibitionSort from "../../components/exhibition/ExhibitionSort";
import ExhibitionList from "../../components/exhibition/ExhibitionList";
import ExhibitionPagination from "../../components/exhibition/ExhibitionPagination";
import "../../styles/ExhibitionAndVenue.css";
import MainLayout from "../../layouts/MainLayout";

const SIZE = 9;

const ExhibitionListPage = () => {
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");

  const [freeExhibitions, setFreeExhibitions] = useState([]);
  const [freePage, setFreePage] = useState(0);
  const [freeTotalPages, setFreeTotalPages] = useState(0);

  const [paidExhibitions, setPaidExhibitions] = useState([]);
  const [paidPage, setPaidPage] = useState(0);
  const [paidTotalPages, setPaidTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [freeData, paidData] = await Promise.all([
          getExhibitionList({ keyword, sort, free: true, page: freePage, size: SIZE }),
          getExhibitionList({ keyword, sort, free: false, page: paidPage, size: SIZE }),
        ]);

        setFreeExhibitions(freeData.content || []);
        setFreeTotalPages(freeData.totalPages || 0);

        setPaidExhibitions(paidData.content || []);
        setPaidTotalPages(paidData.totalPages || 0);
      } catch (error) {
        console.error("전시 목록 조회 실패:", error);
        setError("전시 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [keyword, sort, freePage, paidPage]);

  const handleSearch = (value) => {
    setKeyword(value);
    setFreePage(0);
    setPaidPage(0);
  };

  const handleSort = (value) => {
    setSort(value);
    setFreePage(0);
    setPaidPage(0);
  };

  return (
    <div className="exhibition-list-page">
      <h1>전국 전시 정보</h1>

      <ExhibitionSearch onSearch={handleSearch} />
      <ExhibitionSort value={sort} onChange={handleSort} />

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
          <h2>&lt;무료 전시&gt;</h2>
          <ExhibitionList exhibitions={freeExhibitions} />
          <ExhibitionPagination page={freePage} totalPages={freeTotalPages} onChange={setFreePage} />

          <h2>&lt;유료 전시&gt;</h2>
          <ExhibitionList exhibitions={paidExhibitions} />
          <ExhibitionPagination page={paidPage} totalPages={paidTotalPages} onChange={setPaidPage} />
        </>
      )}
    </div>
  );
};

export default ExhibitionListPage;