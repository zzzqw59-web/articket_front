import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import StaffAuthPostersComponent from "../../components/staff/StaffAuthPostersComponent";
import StatisticBoard from "../../components/staff/StatisticBoard";
import PieChart from "../../components/staff/PieGraph";

const Staffpage = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const pageCache = useRef({});
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);

  const fetchPosters = async (pageNumber) => {
    if (pageCache.current[pageNumber]) {
      return pageCache.current[pageNumber];
    }

    try {
      const response = await getExhibitionList({ page: pageNumber, size: 5 });
      const content = response.content || [];
      pageCache.current[pageNumber] = content;
      setTotalPages(response.totalPages || 0);
      return content;
    } catch (e) {
      console.error("fail to load exhibition posters", e);
    }
  };

  //첫 로드(0,1페이지)
  useEffect(() => {
    const init = async () => {
      const pages = await Promise.all([fetchPosters(0), fetchPosters(1)]);
    };
    init();
  }, []);

  const handlePageChange = async (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages) {
      return;
    }

    await fetchPosters(nextPage);
    setPage(nextPage);
  };

  const handleExhibitionSelect = (exhibition) => {
    setSelectedExhibitions((prev) => {
      const exists = prev.some((item) => item.id === exhibition.id);

      if (exists) {
        return prev.filter((item) => item.id !== exhibition.id);
      }
      if (prev.length >= 5) {
        alert("최대 5개까지 선택 가능합니다.");
        return prev;
      }

      return [...prev, exhibition];
    });
  };

  return (
    <>
      <div className="flex items-end justify-between mx-auto w-[1200px]">
        <div className="mt-10 text-4xl head-text font-bold">내 담당 전시</div>
        <div
          className="text-2xl head-text font-bold hover:text-gray-400 cursor-pointer -translate-x-17"
          onClick={() => navigate("/articket/staffpage/auth")}
        >
          전시 권한 신청하러 가기
        </div>
      </div>
      <StaffAuthPostersComponent
        pageCache={pageCache.current}
        page={page}
        totalPages={totalPages}
        onSelect={handleExhibitionSelect}
        onPageChange={handlePageChange}
      />
      <StatisticBoard selectedExhibitions={selectedExhibitions} />

      <div>
        <PieChart />
      </div>
      <div className="h-96" />
    </>
  );
};
export default Staffpage;
