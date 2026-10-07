import { useState, useEffect } from "react";
import PolygonGraph from "./PolygonGraph";
import BarGraph from "./BarGraph";
import {
  getProfitList,
  getReservationList,
  getVisitorList,
} from "../../api/statisticApi";
import { getStatisticSummary } from "../../utils/statisticUtils";

const StatisticBoard = ({ selectedExhibitions }) => {
  const [isPolygon, setIsPolygon] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("profit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [statIndex, setStatIndex] = useState(0);
  const currentStatData = data[statIndex];
  const summary = getStatisticSummary(currentStatData?.data);

  useEffect(() => {
    setStatIndex(0);
  }, [selectedExhibitions]);

  const formatDate = (date) => {
    if (!date) return "";

    const [, month, day] = date.split("-");

    return `${Number(month)}월 ${Number(day)}일`;
  };

  const statisticApi = {
    profit: getProfitList,
    visitor: getVisitorList,
    reservation: getReservationList,
  };
  const metricUnit = {
    profit: "원",
    visitor: "명",
    reservation: "건",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedExhibitions.length === 0 || !startDate || !endDate) {
        setData([]);
        return;
      }

      const api = statisticApi[selectedMetric];

      const result = await Promise.all(
        selectedExhibitions.map(async (exhibition) => {
          const response = await api(exhibition.id, startDate, endDate);
          return {
            groupName: exhibition.title,
            data: response,
          };
        }),
      );
      setData(result);
    };
    fetchData();
  }, [selectedExhibitions, selectedMetric, startDate, endDate]);

  const metricTitle = {
    profit: "수익",
    visitor: "방문자",
    reservation: "예약",
  };

  return (
    <>
      <div className="flex justify-center gap-5">
        <div className="w-[850px]">
          <div className="flex justify-between items-end">
            <div className="head-text font-bold text-4xl">
              {metricTitle[selectedMetric]} 통계 그래프
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

          {selectedExhibitions.length === 0 ? (
            <div className="w-[850px] h-[400px] m-2 flex flex-col items-center justify-center border border-gray-200  bg-gray-50">
              <div className="text-xl font-bold text-gray-700">
                전시를 선택해주세요
              </div>

              <div className="text-sm text-gray-400 mt-2">
                전시와 조회 기간을 선택하면 통계가 그래프로 표시됩니다.
              </div>
            </div>
          ) : !startDate || !endDate ? (
            <div className="w-[850px] h-[400px] m-2 flex flex-col items-center justify-center border border-gray-200  bg-gray-50">
              <div className="text-xl font-bold text-gray-700">
                조회 기간을 선택해주세요
              </div>

              <div className="text-sm text-gray-400 mt-2">
                조회할 기간을 선택하면 통계가 그래프로 표시됩니다.
              </div>
            </div>
          ) : endDate < startDate ? (
            <div className="w-[850px] h-[400px] m-2 flex flex-col items-center justify-center border border-gray-200  bg-gray-50">
              <div className="text-xl font-bold text-gray-700">
                조회 마감일이 조회 시작일보다 빠를 수 없습니다.
              </div>
            </div>
          ) : isPolygon ? (
            <PolygonGraph data={data} />
          ) : (
            <BarGraph data={data} />
          )}

          <div className="flex justify-between w-full ml-8">
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

        <div className="w-[300px] h-[400px] flex flex-col justify-end">
          {currentStatData ? (
            <>
              <div className="text-xl font-bold mb-5">
                {currentStatData.groupName}
                <br /> {metricTitle[selectedMetric]} 통계치 요약
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="text-sm text-gray-500">평균</div>
                  <div className="text-2xl font-bold">
                    {Math.round(summary.average).toLocaleString()}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">총합</div>
                  <div className="text-2xl font-bold">
                    {summary.total.toLocaleString()}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    최다
                    <span className="text-xs text-gray-400 ml-1">
                      ({formatDate(summary.max?.anchorDate)})
                    </span>
                  </div>

                  <div className="text-2xl font-bold">
                    {summary.max?.value.toLocaleString()}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">
                    최소
                    <span className="text-xs text-gray-400 ml-1">
                      ({formatDate(summary.min?.anchorDate)})
                    </span>
                  </div>

                  <div className="text-2xl font-bold">
                    {summary.min?.value.toLocaleString()}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center self-end gap-5 mt-8">
                <button
                  onClick={() =>
                    setStatIndex((statIndex - 1 + data.length) % data.length)
                  }
                  className="text-xl"
                >
                  &lt;
                </button>

                <span>
                  {statIndex + 1} / {data.length}
                </span>

                <button
                  onClick={() => setStatIndex((statIndex + 1) % data.length)}
                  className="text-xl"
                >
                  &gt;
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center flex flex-col mb-30">
              통계치를 확인하려면
              <br /> 전시와 조회 기간을 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StatisticBoard;
