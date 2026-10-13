import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

const statusInfo = {
  PENDING: {
    label: "승인 대기",
    style: "bg-yellow-100 text-yellow-700",
  },
  APPROVED: {
    label: "승인 완료",
    style: "bg-green-100 text-green-700",
  },
  REJECTED: {
    label: "승인 거절",
    style: "bg-red-100 text-red-700",
  },
};

const StaffRequestComponent = ({ requests = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 신청 목록 개수가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [requests.length]);

  const totalPages = Math.ceil(requests.length / PAGE_SIZE);

  // 현재 페이지에 표시할 데이터만 추출
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentRequests = requests.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="w-full max-w-[1100px] h-[520px] mx-auto mt-6 flex flex-col">
      <div className="flex-1 min-h-0 border-t-2 border-gray-800">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center bg-gray-100 py-4 text-center font-bold text-lg">
          <div>전시 번호</div>
          <div>전시 제목</div>
          <div>신청일</div>
          <div>신청 상태</div>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            신청 내역이 없습니다.
          </div>
        ) : (
          currentRequests.map((request) => {
            const status = statusInfo[request.requestStatus] || {
              label: "알 수 없음",
              style: "bg-gray-100 text-gray-600",
            };

            return (
              <div
                key={request.staffRequestId}
                className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center border-b border-gray-200 py-5 text-center"
              >
                <div>{request.exhibitionId}</div>
                <div className="px-4 text-left truncate">
                  {request.exhibitionTitle}
                </div>
                <div>
                  {request.requestedAt ? request.requestedAt.slice(0, 10) : "-"}
                </div>
                <div>
                  <span
                    className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${status.style}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="shrink-0 flex justify-center items-center gap-2 pt-3 pb-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`min-w-10 px-3 py-2 rounded border ${
                  currentPage === page
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffRequestComponent;
