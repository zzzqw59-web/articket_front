const ListBoard = () => {
const MOCK_ASKS = [
  { id: 1, title: "전시 관람 시간 문의", date: "2026.10.10" },
  { id: 2, title: "주차장 이용 관련 문의", date: "2026.10.09" },
  { id: 3, title: "예약 변경 방법을 알고 싶습니다", date: "2026.10.08" },
];
const MOCK_REVIEWS = [
  { id: 1, title: "작품 구성이 인상적이었어요", date: "2026.10.10" },
  { id: 2, title: "관람 동선이 조금 아쉬워요", date: "2026.10.08" },
  { id: 3, title: "전시 공간이 정말 좋았습니다", date: "2026.10.07" },
];

return(
<div className="flex gap-10 w-[1100px] mx-auto">
    <section className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-gray-400">
            BOARD 01
          </p>
          <h2 className="text-2xl font-bold head-text">문의글</h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
          <span className="text-xl">☰</span>
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {MOCK_ASKS.map((ask) => (
          <li key={ask.id}>
            <button
              type="button"
              className="group w-full py-4 text-left"
              // 나중에 문의 상세 페이지 이동 연결
            >
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 group-hover:bg-black" />

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 transition-colors group-hover:text-black">
                  {ask.title}
                </span>

                <span className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="ml-4 mt-2 text-xs text-gray-400">
                {ask.date}
              </p>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm text-gray-500 transition-colors hover:text-black"
          // 나중에 문의글 전체 목록으로 이동
        >
          <span>최근 문의글</span>
          <span className="font-medium">
            전체 보기 →
          </span>
        </button>
      </div>
    </section>
     <section className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-gray-400">
            BOARD 02
          </p>
          <h2 className="text-2xl font-bold head-text">리뷰글</h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
          <span className="text-xl">✎</span>
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {MOCK_REVIEWS.map((review) => (
          <li key={review.id}>
            <button
              type="button"
              className="group w-full py-4 text-left"
              // 나중에 리뷰 상세 페이지 이동 연결
            >
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 group-hover:bg-black" />

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 transition-colors group-hover:text-black">
                  {review.title}
                </span>

                <span className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="ml-4 mt-2 text-xs text-gray-400">
                {review.date}
              </p>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm text-gray-500 transition-colors hover:text-black"
          // 나중에 리뷰글 전체 목록으로 이동
        >
          <span>최근 리뷰글</span>
          <span className="font-medium">
            전체 보기 →
          </span>
        </button>
      </div>
    </section>
    </div>
);
};
export default ListBoard;