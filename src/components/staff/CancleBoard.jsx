
import { useEffect, useState } from "react";
import PieGraph from "./PieGraph";

const PAGE_SIZE = 5;

// 슬라이드별 임시 데이터
const MOCK_CANCEL_DATA = [
  {
    pieData: [
      { type: "일정 변경", value: 12 },
      { type: "개인 사정", value: 8 },
      { type: "기타", value: 5 },
      { type: "단순 변심", value: 3 },
    ],
    reasons: [
      "갑자기 일정이 변경되어 방문할 수 없게 되었습니다.",
      "교통편 문제로 전시장에 가기 어려워졌습니다.",
      "함께 방문하기로 한 일행이 참석하지 못하게 되었습니다.",
      "예약 날짜를 잘못 선택했습니다.",
      "개인 사정으로 방문이 어렵습니다.",
      "다른 일정과 겹쳐서 취소합니다.",
      "전시 관람이 어려운 상황이 생겼습니다.",
      "방문 날짜를 변경하고 싶어서 취소합니다.",
      "예상치 못한 일이 생겨 방문하지 못합니다.",
      "동행인의 사정으로 방문이 취소되었습니다.",
      "개인적인 사정으로 예약을 취소합니다.",
    ],
  },
  {
    pieData: [
      { type: "일정 변경", value: 6 },
      { type: "개인 사정", value: 14 },
      { type: "기타", value: 9 },
      { type: "단순 변심", value: 4 },
    ],
    reasons: [
      "개인 사정으로 관람이 어려워졌습니다.",
      "다른 지역으로 이동하게 되어 취소합니다.",
      "동행인이 참석할 수 없게 되었습니다.",
      "예약 시간을 맞추기 어려울 것 같습니다.",
      "예상치 못한 일정이 생겼습니다.",
      "방문 날짜를 변경해야 합니다.",
      "교통 문제로 방문이 어려워졌습니다.",
    ],
  },
  {
    pieData: [
      { type: "일정 변경", value: 9 },
      { type: "개인 사정", value: 5 },
      { type: "기타", value: 12 },
      { type: "단순 변심", value: 2 },
    ],
    reasons: [
      "예약한 날짜에 참석할 수 없게 되었습니다.",
      "개인적인 사정으로 취소를 요청합니다.",
      "방문 일정이 다른 일정과 겹쳤습니다.",
      "함께 갈 사람의 사정으로 취소합니다.",
      "전시장까지 이동하기 어려울 것 같습니다.",
      "예상보다 시간이 부족할 것 같습니다.",
    ],
  },
];

const EMPTY_CANCEL_DATA = {
  pieData: [],
  reasons: [],
};

const CancleBoard = ({ selectedExhibitions = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const totalExhibitions = selectedExhibitions.length;

  // 선택된 전시 목록이 바뀌면 유효한 슬라이드 위치 유지
  useEffect(() => {
    setCurrentIndex((prev) =>
      Math.min(prev, Math.max(totalExhibitions - 1, 0))
    );
    setCurrentPage(0);
  }, [totalExhibitions, selectedExhibitions]);

  const currentExhibition = selectedExhibitions[currentIndex];

  // 아직 API 연결 전이므로 슬라이드 순서별 목업 데이터 사용
  const cancelData =
    totalExhibitions > 0
      ? MOCK_CANCEL_DATA[currentIndex % MOCK_CANCEL_DATA.length]
      : EMPTY_CANCEL_DATA;

  const totalPages = Math.ceil(
    cancelData.reasons.length / PAGE_SIZE
  );

  const currentReasons = cancelData.reasons.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
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
      <section className="mx-auto mt-12 w-[1100px]">
        <h2 className="mb-6 text-3xl font-bold head-text">
          취소 통계
        </h2>
        <div className="flex border border-gray-200 p-10 text-center justify-center items-center text-gray-500 h-[300px]">
          위에서 전시를 선택하면 취소 통계를 확인할 수 있습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-12 w-[1200px]">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold head-text">
            취소 통계
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            현재 전시 ID: {currentExhibition.id}
          </p>
        </div>

        {/* 전시 슬라이드 컨트롤 */}
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

      {/* 현재 전시 보드 */}
      <div
        key={currentExhibition.id}
        className="flex flex-row items-start gap-10 rounded-2xl border border-gray-200 bg-white p-8"
      >
        {/* 왼쪽: 그래프 */}
        <div className="w-[55%] shrink-0">
          <h3 className="mb-4 truncate text-xl font-bold">
            {currentExhibition.title || "선택한 전시"}
          </h3>

          <PieGraph data={cancelData.pieData} />
        </div>

        {/* 오른쪽: 기타 취소 사유 */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold">
              기타 취소 사유
            </h3>
            <span className="text-sm text-gray-500">
              총 {cancelData.reasons.length}건
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {currentReasons.map((reason, index) => (
              <li
                key={`${currentExhibition.id}-${currentPage}-${index}`}
                className="py-4"
              >
                <p
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-6 text-gray-700"
                  title={reason}
                >
                  {reason}
                </p>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
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
