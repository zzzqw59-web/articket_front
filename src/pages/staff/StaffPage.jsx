import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getExhibitionDetail } from "../../api/exhibitionApi";
import axiosInstance from "../../api/axiosInstance";
import StaffAuthPostersComponent from "../../components/staff/StaffAuthPostersComponent";
import StatisticBoard from "../../components/staff/StatisticBoard";
import CancleBoard from "../../components/staff/CancleBoard";
import ListBoard from "../../components/staff/ListBoard";

const Staffpage = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const pageCache = useRef({});
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);

  const fetchPosters = async () => {
    try {
      const response = await axiosInstance.get("/api/staff/exhibitions");
      const staffExhibitions = response.data || [];
      const posters = await Promise.all(
        staffExhibitions.map(async (item) => {
          const detail = await getExhibitionDetail(item.exhibitionId);
          return {
            id: item.exhibitionId,
            title: item.exhibitionTitle,
            imgUrl: detail.imgUrl
              ? detail.imgUrl.startsWith("http")
                ? detail.imgUrl
                : `http://localhost:8080/api/images/${detail.imgUrl}`
              : "/images/default-exhibition.jpg",
          };
        }),
      );

      const nextPageCache = {};
      for (let i = 0; i < posters.length; i += 5) {
        nextPageCache[i / 5] = posters.slice(i, i + 5);
      }
      pageCache.current = nextPageCache;
      setTotalPages(Math.ceil(posters.length / 5));
    } catch (e) {
      alert("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      window.location.href = "/articket";
    }
  };

  //첫 로드(0,1페이지)
  useEffect(() => {
    fetchPosters();
  }, []);

  const handlePageChange = async (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages) {
      return;
    }

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
        <div className="mt-20 text-4xl head-text font-bold">내 담당 전시</div>
        <div
          className="text-2xl head-text font-bold hover:text-gray-400 cursor-pointer -translate-x-17"
          onClick={() => navigate("/articket/staffpage/auth")}
        >
          전시 권한 신청하러 가기
        </div>
      </div>
      <div className="h-80">
        <StaffAuthPostersComponent
          pageCache={pageCache.current}
          page={page}
          totalPages={totalPages}
          onSelect={handleExhibitionSelect}
          onPageChange={handlePageChange}
          selectedIds={selectedExhibitions.map((item) => item.id)}
        />
      </div>
      <div className="mt-30 mb-5"></div>
      <StatisticBoard selectedExhibitions={selectedExhibitions} />

      <div className="flex items-center justify-center mt-10">
        <CancleBoard selectedExhibitions={selectedExhibitions} />
      </div>
      <div className="h-10"></div>
      <ListBoard selectedExhibitions={selectedExhibitions} />
      <div className="h-20" />
    </>
  );
};
export default Staffpage;
