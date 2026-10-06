import { useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import StaffAuthExhibitionsComponent from "../../components/staff/StaffAuthExhibitionsComponent";
import PageHeader from "../../components/common/PageHeader";
import ExhibitionPagination from "../../components/exhibition/ExhibitionPagination";
import ExhibitionSearch from "../../components/exhibition/ExhibitionSearch";

const StaffAuthPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchExhibitions = async ({ keyword, page, free = false } = {}) => {
    try {
      const data = await getExhibitionList({ keyword, page, free });
      setExhibitions(data.content || data || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      console.error("fail to load exhibition list", e);
    }
  };

  useEffect(() => {
    fetchExhibitions({ keyword, page });
  }, [keyword, page]);

  const handleSearch = (value) => {
    setKeyword(value);
    setPage(0);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  return (
    <>
      <div className="mt-15">
        <PageHeader
          title={"권한 요청 페이지"}
          description={"신청 버튼을 눌러 권한을 신청하세요."}
        />
      </div>
      <div className="mt-10 translate-y-5">
        <ExhibitionSearch onSearch={handleSearch} />
      </div>
      <div className="flex justify-center mt-30">
        <StaffAuthExhibitionsComponent exhibitions={exhibitions} />
      </div>
      <ExhibitionPagination
        page={page}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
      <div className="h-20"></div>
    </>
  );
};
export default StaffAuthPage;
