import { useState } from "react";
import PolygonGraph from "./PolygonGraph";
import BarGraph from "./BarGraph";

const StatisticBoard = ({ data }) => {
  const [isPolygon, setIsPolygon] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("profit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const metricTitle = {
    profit: "수익 통계",
    visitor: "방문자 통계",
    reservation: "예약 통계",
  };

  return (
    <>
      <div className="flex justify-center gap-5">
        <div className="w-[850px]">
          <div className="flex justify-between items-end">
            <div className="head-text font-bold text-4xl">
              {metricTitle[selectedMetric]}
            </div>

            <div className="flex gap-2 body-text">
              <button
                onClick={() => setSelectedMetric("profit")}
                className={`px-3 py-1 ${selectedMetric === "profit" ? "bg-[#ede6d6]" : "hover:-translate-y-1 hover:bg-gray-100"}`}
              >
                수익
              </button>

              <button
                onClick={() => setSelectedMetric("visitor")}
                className={`px-3 py-1 ${selectedMetric === "visitor" ? "bg-[#ede6d6]" : "hover:-translate-y-1 hover:bg-gray-100"}`}
              >
                방문자
              </button>

              <button
                onClick={() => setSelectedMetric("reservation")}
                className={`px-3 py-1 ${selectedMetric === "reservation" ? "bg-[#ede6d6]" : "hover:-translate-y-1 hover:bg-gray-100"}`}
              >
                예약
              </button>
            </div>
          </div>

          {isPolygon ? <PolygonGraph data={data} /> : <BarGraph data={data} />}

          <div className="flex justify-between w-full">
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-[#0b2342] border-gray-400 border-2 rounded-2xl p-2 head-text"
              />

              <span className="text-[#5c88a8] head-text text-2xl p-1">
                &nbsp;~
              </span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ml-1 text-[#0b2342] border-gray-400 border-2 rounded-2xl p-2 head-text"
              />
            </div>

            <div>
              <button
                onClick={() => setIsPolygon(true)}
                className={`body-text font-bold px-3 py-2 mr-2 
            ${isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300 hover:bg-[#bfd6df]"}`}
              >
                꺾은선
              </button>

              <button
                onClick={() => setIsPolygon(false)}
                className={`body-text font-bold px-3 py-2 
            ${!isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300 hover:bg-[#bfd6df]"}`}
              >
                막대
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-100 w-[300px]">평균 총합 최고 최저</div>
      </div>
    </>
  );
};

export default StatisticBoard;
