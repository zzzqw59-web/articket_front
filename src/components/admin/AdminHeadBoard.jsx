import { useEffect, useMemo, useState } from "react";

const METRICS = {
  profit: { label: "수익", unit: "원" },
  visitor: { label: "방문자", unit: "명" },
  reservation: { label: "예약", unit: "건" },
};

const formatNumber = (value) =>
  new Intl.NumberFormat("ko-KR").format(Number(value) || 0);

const SUMMARY_ITEMS = [
  { key: "average", label: "평균" },
  { key: "total", label: "총합" },
  { key: "max", label: "최고" },
  { key: "min", label: "최저" },
];

const AdminHeadBoard = ({
  exhibitions = [],
  fetchStatistic,
  onSelectedIdsChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("profit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalStatistic, setTotalStatistic] = useState(null);
  const [summary, setSummary] = useState({
    average: 0,
    max: 0,
    min: 0,
    maxDate: null,
    minDate: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentMetric = METRICS[selectedMetric];

  const filteredExhibitions = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return exhibitions;

    return exhibitions.filter((exhibition) =>
      exhibition.title?.toLowerCase().includes(keyword),
    );
  }, [exhibitions, searchText]);

  const handleExhibitionChange = (exhibitionId) => {
    setSelectedIds((prev) =>
      prev.includes(exhibitionId)
        ? prev.filter((id) => id !== exhibitionId)
        : [...prev, exhibitionId],
    );
  };

  useEffect(() => {
    onSelectedIdsChange?.(selectedIds);
  }, [selectedIds, onSelectedIdsChange]);

  const getSummaryValue = (key) => {
    if (key === "total") return totalStatistic ?? 0;

    const item = summary?.[key];

    // 기존 유틸 함수가 max/min 객체를 반환하는 경우와
    // 숫자를 반환하는 경우를 모두 처리합니다.
    if (item && typeof item === "object") {
      return item.value ?? 0;
    }

    return item ?? 0;
  };

  const getSummaryDate = (key) => {
    const item = summary?.[key];

    if (item && typeof item === "object") {
      return item.anchorDate ?? item.date ?? null;
    }

    return summary?.[key === "max" ? "maxDate" : "minDate"] ?? null;
  };

  const formatDate = (date) => {
    if (!date) return "";

    const value = String(date);
    return value.length >= 10 ? value.slice(0, 10) : value;
  };

  return (
    <section className="mx-auto w-full max-w-[1100px]">
      <h1 className="head-text mb-6 text-4xl font-bold -translate-x-10">
        전시 통계
      </h1>

      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
        {/* 전시 선택 */}
        <section className="flex min-h-[400px] min-w-0 flex-col border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-bold">전시 선택</h2>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="전시 제목 검색"
              className="w-full rounded border border-gray-300 px-3 py-2 pr-9 text-sm outline-none focus:border-gray-700"
            />
            <span className="absolute right-3 top-2 -scale-x-100 text-gray-400">
              ⌕
            </span>
          </div>

          <div className="h-[250px] shrink-0 overflow-y-auto">
            {filteredExhibitions.length ? (
              filteredExhibitions.map((exhibition) => (
                <label
                  key={exhibition.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-1 py-3 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(exhibition.id)}
                    onChange={() => handleExhibitionChange(exhibition.id)}
                    className="h-4 w-4 shrink-0 accent-gray-900"
                  />
                  <span className="min-w-0 truncate text-sm">
                    {exhibition.title}
                  </span>
                </label>
              ))
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">
                {searchText.trim()
                  ? "검색 결과가 없습니다."
                  : "전시 목록이 없습니다."}
              </p>
            )}
          </div>

          <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
            선택한 전시 {selectedIds.length}개
          </p>
        </section>

        {/* 통계 요약 */}
        <section className="flex min-h-[400px] min-w-0 flex-col border border-gray-200 bg-white p-5">
          <h2 className="mb-5 text-xl font-bold">통계 요약</h2>

          {/* 통계 항목 */}
          <div className="mb-5 flex gap-2">
            {Object.entries(METRICS).map(([key, metric]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedMetric(key)}
                className={`rounded border px-4 py-2 text-sm transition ${
                  selectedMetric === key
                    ? "border-gray-900 bg-gray-900 font-bold text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>

          {/* 조회 기간 */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-2 text-sm"
              aria-label="조회 시작일"
            />

            <span className="text-gray-400">~</span>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-2 text-sm"
              aria-label="조회 종료일"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center">
            {!startDate || !endDate ? (
              <p className="text-center leading-7 text-gray-400">
                통계치를 확인하려면
                <br />
                조회 기간을 선택해주세요.
              </p>
            ) : loading ? (
              <p className="text-center text-gray-400">
                통계를 불러오는 중입니다...
              </p>
            ) : error ? (
              <p className="text-center text-sm text-red-500">{error}</p>
            ) : (
              <>
                <p className="mb-5 text-xs text-gray-400 ml-5">
                  {startDate} ~ {endDate}
                </p>

                <div className="grid grid-cols-2 gap-x-5 gap-y-7 ml-5">
                  {SUMMARY_ITEMS.map(({ key, label }) => (
                    <div key={key} className="min-w-0">
                      <p className="mb-1 text-sm text-gray-500">
                        {label}
                        {(key === "max" || key === "min") && (
                          <span className="ml-1 text-xs text-gray-400">
                            ({formatDate(getSummaryDate(key)) || "-"})
                          </span>
                        )}
                      </p>

                      <p className="text-2xl font-bold">
                        {formatNumber(getSummaryValue(key))}
                        <span className="ml-1 text-sm font-normal text-gray-400">
                          {currentMetric.unit}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default AdminHeadBoard;
