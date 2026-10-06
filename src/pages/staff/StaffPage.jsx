import { useNavigate } from "react-router-dom";
import BarGraph from "../../components/staff/BarGraph";
import PolygonGraph from "../../components/staff/PolygonGraph";
import { useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import StaffAuthPostersComponent from "../../components/staff/StaffAuthPostersComponent";

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
  ];
  const [isPolygon, setIsPolygon] = useState(true);
  const [posters, setPosters] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const [selectedExhibitionIds, setSelectedExhibitionIds] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("profit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const metricTitle = {
    profit: "수익 통계",
    visitor: "방문자 통계",
    reservation: "예약 통계",
  };

  const fetchPosters = async ({ page, size = 5 } = {}) => {
    try {
      const data = await getExhibitionList({ page, size });
      setPosters(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      console.error("fail to load exhibition posters", e);
    }
  };

  useEffect(() => {
    fetchPosters({ page });
  }, [page]);

  const handlePageChange = (value) => {
    setPage(value);
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
        data={posters}
        onSelect={handleExhibitionSelect}
      />

      <div className="flex justify-between w-[850px] ml-90 self-end">
        <div className="head-text font-bold text-4xl">
          {metricTitle[selectedMetric]}
        </div>
        <div className="flex gap-2 body-text">
          <button
            onClick={() => setSelectedMetric("profit")}
            className="cursor-pointer bg-"
          >
            수익
          </button>

          <button onClick={() => setSelectedMetric("visitor")}>방문자</button>

          <button onClick={() => setSelectedMetric("reservation")}>예약</button>
        </div>
      </div>

      <div className="flex justify-center gap-5">
        <div>
          {isPolygon ? <PolygonGraph data={data} /> : <BarGraph data={data} />}

          <div className="flex justify-between w-[900px] cursor-none text-white">
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-[#0b2342] border-[#5c88a8] border-2 rounded-2xl p-2 head-text"
              />
              <span className="text-[#5c88a8] head-text text-2xl p-1">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ml-1 text-[#0b2342] border-[#5c88a8] border-2 rounded-2xl p-2 head-text"
              />
            </div>
            <div>
              <button
                onClick={() => setIsPolygon(true)}
                className={`body-text font-bold px-3 py-2 hover:bg-[#bfd6df] mr-2
            ${isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300"}`}
              >
                꺾은선
              </button>
              <button
                onClick={() => setIsPolygon(false)}
                className={`body-text font-bold px-3 py-2 hover:bg-[#bfd6df] 
            ${!isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300"}`}
              >
                막대
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-amber-100 h-full">
            평균 중앙값 최고 최저 어쩌고 wjWJrh..
          </div>
        </div>
      </div>
      <div className="h-96" />
    </>
  );
};
export default Staffpage;
