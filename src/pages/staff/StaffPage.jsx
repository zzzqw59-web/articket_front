import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import StaffAuthPostersComponent from "../../components/staff/StaffAuthPostersComponent";
import StatisticBoard from "../../components/staff/StatisticBoard";

const Staffpage = () => {
  const data = [
    {
      groupName: "올해",
      data: [
        { month: "1월", visitors: 420, type: "올해" },
        { month: "2월", visitors: 3000, type: "올해" },
        { month: "3월", visitors: 510, type: "올해" },
        { month: "4월", visitors: 630, type: "올해" },
        { month: "5월", visitors: 750, type: "올해" },
        { month: "6월", visitors: 820, type: "올해" },
      ],
    },
    {
      groupName: "작년",
      data: [
        { month: "1월", visitors: 300, type: "작년" },
        { month: "2월", visitors: 1500, type: "작년" },
        { month: "3월", visitors: 400, type: "작년" },
        { month: "4월", visitors: 500, type: "작년" },
        { month: "5월", visitors: 600, type: "작년" },
        { month: "6월", visitors: 700, type: "작년" },
      ],
    },
    {
      groupName: "재작년",
      data: [
        { month: "1월", visitors: 3000, type: "재작년" },
        { month: "2월", visitors: 150, type: "재작년" },
        { month: "3월", visitors: 40, type: "재작년" },
        { month: "4월", visitors: 50, type: "재작년" },
        { month: "5월", visitors: 800, type: "재작년" },
        { month: "6월", visitors: 400, type: "재작년" },
      ],
    },
    {
      groupName: "1",
      data: [
        { month: "1월", visitors: 3000, type: "1" },
        { month: "2월", visitors: 150, type: "1" },
        { month: "3월", visitors: 40, type: "1" },
        { month: "4월", visitors: 50, type: "1" },
        { month: "5월", visitors: 800, type: "1" },
        { month: "6월", visitors: 400, type: "1" },
      ],
    },
  ];

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const pageCache = useRef({});
  const [selectedExhibitionIds, setSelectedExhibitionIds] = useState([]);

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

  const handleExhibitionSelect = (id) => {
    setSelectedExhibitionIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 5) {
        alert("최대 5개까지 선택 가능합니다.");
        return prev;
      }
      return [...prev, id];
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
      <StatisticBoard data={data} />
      <div className="h-96" />
    </>
  );
};
export default Staffpage;
