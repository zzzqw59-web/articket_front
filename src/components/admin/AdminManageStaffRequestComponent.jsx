import { useCallback, useEffect, useState } from "react";
import {
  patchApproveStaffRequest,
  patchRejectStaffRequest,
  getStaffRequestsAll,
} from "../../api/staffApi";

const PAGE_SIZE = 7;

const COLUMN_WIDTHS = {
  status: "100px",
  memberId: "90px",
  nickname: "120px",
  exhibitionTitle: "200px",
  requestedAt: "120px",
  processedAt: "120px",
  action: "150px",
};

const COLUMNS = [
  { key: "status", label: "신청 상태" },
  { key: "memberId", label: "멤버 ID" },
  { key: "nickname", label: "닉네임" },
  { key: "exhibitionTitle", label: "전시 제목" },
  { key: "requestedAt", label: "신청 일시" },
  { key: "processedAt", label: "처리 일시" },
  { key: "action", label: "관리" },
];

const STATUS = {
  PENDING: {
    label: "대기 중",
    style: "bg-amber-50 text-amber-700",
  },
  APPROVED: {
    label: "허가 완료",
    style: "bg-green-50 text-green-700",
  },
  REJECTED: {
    label: "거절 완료",
    style: "bg-red-50 text-red-700",
  },
};

// 날짜 포맷
const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// API 응답 형태에 맞춰 신청 목록 추출
const getRequestList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.dtoList)) return response.dtoList;
  if (Array.isArray(response?.data?.dtoList)) {
    return response.data.dtoList;
  }

  return [];
};

// 페이지 번호 배열 생성
const getPageNumbers = (totalPages) =>
  Array.from({ length: totalPages }, (_, index) => index + 1);

const AdminManageStaffRequestComponent = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));

  const pageRequests = requests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const displayRows = Array.from(
    { length: PAGE_SIZE },
    (_, index) => pageRequests[index] ?? null,
  );

  // 신청 목록 조회
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getStaffRequestsAll();
      const list = getRequestList(response);

      setRequests(list);

      const lastPage = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

      setCurrentPage((page) => Math.min(page, lastPage));
    } catch (error) {
      console.error("전시 권한 신청 목록 조회 실패:", error);

      alert(
        error.response?.data?.message || "신청 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // 페이지 이동
  const changePage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // 허가 또는 거절 처리
  const handleProcess = async (requestId, action) => {
    const isApprove = action === "approve";

    const message = isApprove
      ? "이 신청을 허가하시겠습니까?"
      : "이 신청을 거절하시겠습니까?";

    if (!window.confirm(message)) return;

    try {
      setProcessingId(requestId);

      if (isApprove) {
        await patchApproveStaffRequest(requestId);
      } else {
        await patchRejectStaffRequest(requestId);
      }

      alert(
        isApprove
          ? "전시 권한 신청을 허가했습니다."
          : "전시 권한 신청을 거절했습니다.",
      );

      await fetchRequests();
    } catch (error) {
      console.error("신청 처리 실패:", error);

      alert(
        error.response?.data?.message || "신청 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // 관리 버튼
  const renderActionButtons = (request) => {
    const { staffRequestId, requestStatus } = request;
    const isProcessing = processingId === staffRequestId;

    if (requestStatus !== "PENDING") {
      return (
        <span className="block text-center text-xs text-gray-400">
          처리 완료
        </span>
      );
    }

    return (
      <div className="flex justify-center gap-2">
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleProcess(staffRequestId, "approve")}
          className="whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "처리 중..." : "허가"}
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleProcess(staffRequestId, "reject")}
          className="whitespace-nowrap rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          거절
        </button>
      </div>
    );
  };

  // 셀 데이터 생성
  const getRowCells = (request) => [
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS[request.requestStatus]?.style ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {STATUS[request.requestStatus]?.label ?? request.requestStatus ?? "-"}
    </span>,
    request.memberId ?? "-",
    request.memberNickname || "-",
    request.exhibitionTitle || "-",
    formatDate(request.requestedAt),
    formatDate(request.processedAt),
    renderActionButtons(request),
  ];

  // 테이블 행
  const renderRequestRow = (request, index) => {
    if (!request) {
      return (
        <tr
          key={`empty-${currentPage}-${index}`}
          aria-hidden="true"
          className="h-[60px]"
        >
          {COLUMNS.map((column) => (
            <td key={column.key} className="px-5 py-4">
              &nbsp;
            </td>
          ))}
        </tr>
      );
    }

    const cells = getRowCells(request);

    return (
      <tr
        key={request.staffRequestId}
        className="h-[75px] transition hover:bg-gray-50"
      >
        {cells.map((cell, index) => (
          <td
            key={COLUMNS[index].key}
            className={`overflow-hidden px-5 py-4 text-gray-600 ${
              index === 2 ? "font-medium text-gray-900" : ""
            } ${
              index === 4 || index === 5 ? "whitespace-nowrap" : ""
            } ${index === 6 ? "text-center" : ""}`}
          >
            {cell}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      {/* 제목 */}
      <div className="mb-6 flex items-start justify-between">
        <h2 className="head-text text-4xl font-bold">전시 권한 신청 관리</h2>

        <div className="translate-y-6 text-right text-sm text-gray-500">
          총 {requests.length}건
        </div>
      </div>

      {/* 신청 목록 테이블 */}
      <div className="overflow-x-auto border border-gray-200 bg-white">
        <table
          className="w-full min-w-[1000px] text-left text-sm"
          style={{ tableLayout: "fixed" }}
        >
          <colgroup>
            {COLUMNS.map((column) => (
              <col
                key={column.key}
                style={{ width: COLUMN_WIDTHS[column.key] }}
              />
            ))}
          </colgroup>

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className={`h-[53px] px-5 py-4 font-semibold ${
                    column.key === "action" ? "text-center" : ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="h-[455px] px-5 text-center text-gray-500"
                >
                  신청 목록을 불러오는 중입니다.
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="h-[455px] px-5 text-center text-gray-500"
                >
                  신청 내역이 없습니다.
                </td>
              </tr>
            ) : (
              displayRows.map((request, index) =>
                renderRequestRow(request, index),
              )
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {!isLoading && requests.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>

          {getPageNumbers(totalPages).map((page) => (
            <button
              key={page}
              type="button"
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => changePage(page)}
              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                currentPage === page
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminManageStaffRequestComponent;
