import { useState, useEffect } from "react";
import PolygonGraph from "./PolygonGraph";
import BarGraph from "./BarGraph";
import {
  getProfitList,
  getReservationList,
  getVisitorList,
  getCanceledReservationList,
} from "../../api/statisticApi";
import { getStatisticSummary } from "../../utils/statisticUtils";

const StatisticBoard = ({ selectedExhibitions = [] }) => {
  const [isPolygon, setIsPolygon] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("profit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [statIndex, setStatIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentStatData = data[statIndex];
  const summary = getStatisticSummary(currentStatData?.data);

  const statisticApi = {
    profit: getProfitList,
    visitor: getVisitorList,
    reservation: getReservationList,
    canceledReservation: getCanceledReservationList,
  };

  const metricUnit = {
    profit: "원",
    visitor: "명",
    reservation: "건",
    canceledReservation: "건",
  };

  const metricTitle = {
    profit: "수익",
    visitor: "방문자",
    reservation: "예약",
    canceledReservation: "예약 취소",
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const [, month, day] = date.split("-");
    return `${Number(month)}월 ${Number(day)}일`;
  };

  const formatNumber = (value) => Number(value ?? 0).toLocaleString("ko-KR");

  useEffect(() => {
    setStatIndex(0);
  }, [selectedExhibitions]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (
        selectedExhibitions.length === 0 ||
        !startDate ||
        !endDate ||
        endDate < startDate
      ) {
        setData([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
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

        if (!cancelled) {
          setData(result);
          setStatIndex(0);
        }
      } catch (err) {

        if (!cancelled) {
          setData([]);
          setError("통계 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [selectedExhibitions, selectedMetric, startDate, endDate]);

  const changeMetric = (metric) => {
    setSelectedMetric(metric);
    setStatIndex(0);
  };

  const renderEmptyState = (title, description) => (
    <div className="flex h-[450px] w-full flex-col items-center justify-center border border-gray-200 bg-gray-50">
      <div className="text-xl font-bold text-gray-700">{title}</div>
      {description && (
        <div className="mt-2 text-sm text-gray-400">{description}</div>
      )}
    </div>
  );

  return (
    <section className="mx-auto w-[1400px] shrink-0">
      <div className="flex w-full items-start gap-[50px]">
        <div className="w-[1050px] min-w-0 shrink-0">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="head-text text-4xl font-bold">
              {metricTitle[selectedMetric]} 통계 그래프
            </h2>

            <div className="body-text flex shrink-0 gap-2">
              {Object.entries(metricTitle).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => changeMetric(key)}
                  className={`px-3 py-1 transition ${
                    selectedMetric === key
                      ? "bg-[#ede6d6] font-bold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 그래프 표시 영역 */}
          {selectedExhibitions.length === 0 ? (
            renderEmptyState(
              "전시를 선택해주세요",
              "전시와 조회 기간을 선택하면 통계가 그래프로 표시됩니다.",
            )
          ) : !startDate || !endDate ? (
            renderEmptyState(
              "조회 기간을 선택해주세요",
              "조회할 기간을 선택하면 통계가 그래프로 표시됩니다.",
            )
          ) : endDate < startDate ? (
            renderEmptyState(
              "조회 마감일이 조회 시작일보다 빠를 수 없습니다.",
              "",
            )
          ) : loading ? (
            renderEmptyState("통계를 불러오는 중입니다...", "")
          ) : error ? (
            renderEmptyState(error, "")
          ) : (
            <div className="w-full min-w-0">
              {isPolygon ? (
                <PolygonGraph data={data} />
              ) : (
                <BarGraph data={data} />
              )}
            </div>
          )}

          {/* 조회 기간 및 그래프 유형 */}
          <div className="mt-5 flex w-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="min-w-0 rounded-2xl border-2 border-gray-400 p-2 text-[#0b2342] head-text"
                aria-label="조회 시작일"
              />

              <span className="head-text px-1 text-2xl text-[#5c88a8]">~</span>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="min-w-0 rounded-2xl border-2 border-gray-400 p-2 text-[#0b2342] head-text"
                aria-label="조회 종료일"
              />
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setIsPolygon(true)}
                className={`body-text px-3 py-2 font-bold ${
                  isPolygon
                    ? "bg-[#0b2342] text-white"
                    : "bg-gray-300 hover:bg-[#bfd6df]"
                }`}
              >
                꺾은선
              </button>

              <button
                type="button"
                onClick={() => setIsPolygon(false)}
                className={`body-text px-3 py-2 font-bold ${
                  !isPolygon
                    ? "bg-[#0b2342] text-white"
                    : "bg-gray-300 hover:bg-[#bfd6df]"
                }`}
              >
                막대
              </button>
            </div>
          </div>
        </div>

        {/* 통계 요약 영역: 300px */}
        <aside className="flex w-[300px] min-w-0 shrink-0 flex-col pt-10">
          {currentStatData ? (
            <>
              <div className="mb-5 text-xl font-bold leading-8">
                {currentStatData.groupName}
                <br />
                {metricTitle[selectedMetric]} 통계치 요약
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-7">
                {/* 평균 */}
                <div className="min-w-0">
                  <div className="text-sm text-gray-500">평균</div>
                  <div className="mt-1 text-2xl font-bold">
                    {formatNumber(Math.round(summary?.average ?? 0))}
                    <span className="ml-1 text-sm font-normal text-gray-400">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>

                {/* 총합 */}
                <div className="min-w-0">
                  <div className="text-sm text-gray-500">총합</div>
                  <div className="mt-1 text-2xl font-bold">
                    {formatNumber(summary?.total)}
                    <span className="ml-1 text-sm font-normal text-gray-400">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>

                {/* 최다 */}
                <div className="min-w-0">
                  <div className="text-sm text-gray-500">
                    최다
                    <span className="ml-1 text-xs text-gray-400">
                      ({formatDate(summary?.max?.anchorDate)})
                    </span>
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    {formatNumber(summary?.max?.value)}
                    <span className="ml-1 text-sm font-normal text-gray-400">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>

                {/* 최소 */}
                <div className="min-w-0">
                  <div className="text-sm text-gray-500">
                    최소
                    <span className="ml-1 text-xs text-gray-400">
                      ({formatDate(summary?.min?.anchorDate)})
                    </span>
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    {formatNumber(summary?.min?.value)}
                    <span className="ml-1 text-sm font-normal text-gray-400">
                      {metricUnit[selectedMetric]}
                    </span>
                  </div>
                </div>
              </div>

              {/* 선택한 전시 간 이동 */}
              {data.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() =>
                      setStatIndex((statIndex - 1 + data.length) % data.length)
                    }
                    className="text-xl"
                    aria-label="이전 전시 통계"
                  >
                    &lt;
                  </button>

                  <span className="text-sm">
                    {statIndex + 1} / {data.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => setStatIndex((statIndex + 1) % data.length)}
                    className="text-xl"
                    aria-label="다음 전시 통계"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex mt-50 flex-col items-center text-center text-sm leading-7 text-gray-400">
              통계치를 확인하려면
              <br />
              전시와 조회 기간을 선택해주세요.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};

export default StatisticBoard;
