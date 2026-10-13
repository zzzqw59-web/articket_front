import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminPageAsk } from "../../api/askApi";

const PAGE_SIZE = 5;

const AdminManageAskComponent = () => {
  const [askList, setAskList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsks = async () => {
      setLoading(true);

      try {
        const data = await getAdminPageAsk({
          page,
          size: PAGE_SIZE,
        });

        setAskList(data.dtoList ?? []);
        setTotalPage(data.totalPage ?? 0);
      } catch (error) {
        console.error("문의 목록 조회 실패:", error);
        setAskList([]);
        setTotalPage(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAsks();
  }, [page]);

  // 문의 상세 페이지 이동
  const handleAskClick = (askId) => {
    if (!askId || loading) return;

    navigate(`/articket/ask/${askId}`);
  };

  // 항상 5개 행 유지
  const displayList = Array.from(
    { length: PAGE_SIZE },
    (_, index) => askList[index] ?? null,
  );

  return (
    <div className="mx-auto w-[1400px]">
      <div className="head-text mb-5 text-4xl font-bold">문의 관리</div>

      <div className="overflow-hidden border border-gray-300">
        {/* 테이블 헤더 */}
        <div className="grid h-[60px] grid-cols-[150px_1fr_200px_300px_150px] items-center border-b-2 border-gray-300 bg-gray-100 text-center font-bold">
          <div>번호</div>
          <div>제목</div>
          <div>닉네임</div>
          <div>작성시간</div>
          <div>조회수</div>
        </div>

        {/* 문의 목록 */}
        {displayList.map((ask, index) => (
          <div
            key={ask?.askId ?? `empty-${index}`}
            onClick={() => ask && handleAskClick(ask.askId)}
            onKeyDown={(e) => {
              if (ask && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleAskClick(ask.askId);
              }
            }}
            role={ask ? "button" : undefined}
            tabIndex={ask ? 0 : undefined}
            className={`grid h-[60px] grid-cols-[150px_1fr_200px_300px_150px] items-center border-b border-gray-200 text-center ${
              ask && !loading
                ? "cursor-pointer transition-colors hover:bg-gray-50"
                : ""
            }`}
          >
            {loading ? (
              <div className="col-span-5 text-gray-400">조회 중...</div>
            ) : (
              <>
                <div>{ask?.askId ?? ""}</div>
                <div className="truncate px-4">{ask?.askTitle ?? ""}</div>
                <div>{ask?.memberNickname ?? ""}</div>
                <div>{ask?.askCreatedAt ?? ""}</div>
                <div>{ask?.askHits ?? ""}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 페이징 */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((prev) => prev - 1)}
          className="h-10 rounded-lg border px-4 disabled:opacity-30"
        >
          이전
        </button>

        {Array.from({ length: totalPage }, (_, index) => index + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              type="button"
              disabled={loading}
              onClick={() => setPage(pageNum)}
              className={`h-10 min-w-10 rounded-lg border px-3 ${
                page === pageNum
                  ? "border-gray-800 bg-gray-800 text-white"
                  : "border-gray-300"
              }`}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPage || loading || totalPage === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className="h-10 rounded-lg border px-4 disabled:opacity-30"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminManageAskComponent;
