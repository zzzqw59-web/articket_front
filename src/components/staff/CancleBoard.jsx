import { useEffect, useState } from "react";
import PieGraph from "./PieGraph";
import { getCancelList, getCancelDetail } from "../../api/statisticApi";

const PAGE_SIZE = 5;

const EMPTY_CANCEL_DATA = {
  pieData: [],
  reasons: [],
};

const CancleBoard = ({ selectedExhibitions = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [cancelData, setCancelData] = useState(EMPTY_CANCEL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalExhibitions = selectedExhibitions.length;
  const currentExhibition = selectedExhibitions[currentIndex];

  const exhibitionId = currentExhibition?.id ?? currentExhibition?.exhibitionId;

  // 선택된 전시가 변경되면 인덱스와 페이지를 초기화합니다.
  useEffect(() => {
    setCurrentIndex((prev) =>
      Math.min(prev, Math.max(selectedExhibitions.length - 1, 0)),
    );
    setCurrentPage(0);
  }, [selectedExhibitions.length]);

  // 현재 전시의 취소 통계와 기타 취소 상세 내역을 조회합니다.
  useEffect(() => {
    if (exhibitionId == null) {
      setCancelData(EMPTY_CANCEL_DATA);
      setLoading(false);
      setError("");
      return;
    }

    let canceled = false;

    const fetchCancelStats = async () => {
      setLoading(true);
      setError("");
      setCancelData(EMPTY_CANCEL_DATA);
      setCurrentPage(0);

      try {
        const [cancelResponse, detailResponse] = await Promise.all([
          getCancelList(exhibitionId),
          getCancelDetail(exhibitionId),
        ]);

        if (canceled) return;

        // 취소 사유별 통계 데이터를 가공합니다.
        const cancelList = cancelResponse?.data ?? cancelResponse;
        const detailList = detailResponse?.data ?? detailResponse;

        const pieData = Array.isArray(cancelList)
          ? cancelList.map((item) => ({
              type: item.type,
              value: Number(item.value ?? 0),
            }))
          : [];

        // 상세 취소 사유와 날짜를 화면에서 사용하는 필드명으로 변환합니다.
        const reasons = Array.isArray(detailList)
          ? detailList.map((item) => ({
              date: item.cancelDate ?? "",
              detail: item.reason ?? "",
            }))
          : [];

        setCancelData({ pieData, reasons });
      } catch (err) {
        if (canceled) return;

        console.error("취소 통계 조회 실패:", err);
        setError("취소 통계를 불러오지 못했습니다.");
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    fetchCancelStats();

    return () => {
      canceled = true;
    };
  }, [exhibitionId]);

  const totalPages = Math.ceil(cancelData.reasons.length / PAGE_SIZE);

  const currentReasons = cancelData.reasons.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  const handleSlideChange = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= totalExhibitions) return;

    setCurrentIndex(nextIndex);
    setCurrentPage(0);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages) return;

    setCurrentPage(nextPage);
  };

  if (totalExhibitions === 0) {
    return (
      <section className="mx-auto mt-12 w-[1400px]">
        <h2 className="mb-6 text-4xl head-text font-bold">예약 취소</h2>

        <div className="flex h-[400px] items-center justify-center border border-gray-200 p-10 text-center text-gray-500">
          위에서 전시를 선택하면 취소 통계를 확인할 수 있습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-12 w-[1400px]">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-4xl font-bold head-text">예약 취소</h2>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSlideChange(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="rounded-full border border-gray-300 p-2 disabled:opacity-30"
            aria-label="이전 전시"
          >
            ←
          </button>

          <span className="min-w-[90px] text-center text-sm text-gray-600">
            {currentIndex + 1} / {totalExhibitions}
          </span>

          <button
            type="button"
            onClick={() => handleSlideChange(currentIndex + 1)}
            disabled={currentIndex === totalExhibitions - 1}
            className="rounded-full border border-gray-300 p-2 disabled:opacity-30"
            aria-label="다음 전시"
          >
            →
          </button>
        </div>
      </div>

      <div
        key={exhibitionId}
        className="flex flex-row items-start gap-10 border border-gray-200 bg-white p-8"
      >
        <div className="shrink-0">
          <h3 className="mb-4 truncate text-xl font-bold -translate-y-3">
            {currentExhibition.title ??
              currentExhibition.exhibitionTitle ??
              "선택한 전시"}
          </h3>

          {loading ? (
            <div className="flex h-[300px] min-w-[600px] items-center justify-center text-gray-500">
              취소 통계를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="flex h-[300px] min-w-[600px] items-center justify-center text-gray-500">
              {error}
            </div>
          ) : cancelData.pieData.length > 0 ? (
            <PieGraph data={cancelData.pieData} />
          ) : (
            <div className="flex h-[300px] min-w-[600px] items-center justify-center text-gray-500">
              표시할 취소 통계가 없습니다.
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col min-h-[420px]">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold">기타 취소 사유</h3>

            <span className="text-sm text-gray-500">
              총 {cancelData.reasons.length}건
            </span>
          </div>

          {loading ? (
            <p className="py-4 text-sm text-gray-500">
              취소 사유를 불러오는 중입니다.
            </p>
          ) : error ? (
            <p className="py-4 text-sm text-gray-500">
              취소 사유를 불러오지 못했습니다.
            </p>
          ) : currentReasons.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {currentReasons.map((reason, index) => (
                <li
                  key={`${exhibitionId}-${currentPage}-${index}`}
                  className="py-4"
                >
                  <p className="text-xs text-gray-400">
                    {reason.cancelDate ? reason.date.replace("T", " ") : ""}
                  </p>

                  <p
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-6 text-gray-700"
                    title={reason.detail}
                  >
                    {reason.detail || "상세 사유 없음"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-gray-500">
              등록된 기타 취소 사유가 없습니다.
            </p>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="mt-auto flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                이전
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePageChange(index)}
                  className={`h-9 min-w-9 rounded-lg border px-3 text-sm ${
                    currentPage === index
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CancleBoard;
