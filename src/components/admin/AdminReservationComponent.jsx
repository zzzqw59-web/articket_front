import { useCallback, useEffect, useState } from "react";
import {
  getReservationList,
  cancelReservation,
} from "../../api/reservationApi";

const PAGE_SIZE = 7;

const AdminReservationComponent = () => {
  const [reservations, setReservations] = useState([]);
  const [pageData, setPageData] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);

  // 예약 목록 조회
  const fetchReservations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getReservationList(page, PAGE_SIZE, keyword);
      const data = response.data;

      setReservations(data.dtoList ?? []);
      setPageData(data);
    } catch (err) {
      setReservations([]);
      setPageData({});
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 검색
  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    setKeyword(searchInput.trim());
  };

  // 예약 취소
  const handleCancel = async (reservation) => {
    const confirmed = window.confirm(
      `${reservation.reservationId}번 예약을 취소하시겠습니까?`,
    );

    if (!confirmed) return;

    setCancelingId(reservation.reservationId);

    try {
      await cancelReservation(reservation.reservationId, {
        reason: "OTHER",
        detail: "관리자에 의한 예약 취소",
      });

      await fetchReservations();
    } catch (err) {
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="w-full min-w-0 py-8">
      <div className="mx-auto w-[1400px] max-w-full px-4">
        <div className="mb-6">
          <h2 className="head-text text-4xl font-bold text-gray-900">
            예약 관리
          </h2>
        </div>

        {/* 예약 목록 카드 */}
        <section className="overflow-hidden border border-gray-200">
          {/* 검색 영역 */}
          <form
            onSubmit={handleSearch}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50/70 px-5 py-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="전시명 검색"
                className="h-9 w-60 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />

              <button
                type="submit"
                className="h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                검색
              </button>
            </div>
          </form>

          {/* 예약 테이블 */}
          <div className="min-h-[460px] w-full overflow-auto">
            <table className="w-full min-w-[1050px] table-fixed border-collapse text-center text-sm">
              <colgroup>
                <col className="w-[85px]" />
                <col className="w-[60px]" />
                <col className="w-[100px]" />
                <col className="w-[200px]" />
                <col className="w-[75px]" />
                <col className="w-[100px]" />
                <col className="w-[100px]" />
                <col className="w-[55px]" />
                <col className="w-[95px]" />
                <col className="w-[70px]" />
                <col className="w-[70px]" />
                <col className="w-[95px]" />
              </colgroup>

              <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600">
                <tr>
                  {[
                    "예약 상태",
                    "예약 번호",
                    "주문 번호",
                    "전시명",
                    "예약자",
                    "전화번호",
                    "예약 날짜",
                    "인원",
                    "결제 금액",
                    "결제일",
                    "취소일",
                    "관리",
                  ].map((label) => (
                    <th
                      key={label}
                      className="h-11 border-b border-gray-200 px-2 font-semibold"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="h-48 text-gray-400">
                      예약 목록을 불러오는 중입니다.
                    </td>
                  </tr>
                ) : reservations.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="h-48">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <span className="text-2xl">⌕</span>
                        <span className="text-sm">조회된 예약이 없습니다.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => {
                    const isCanceled =
                      reservation.reservationStatus === "CANCELED";

                    const isCanceling =
                      cancelingId === reservation.reservationId;

                    const memberName = reservation.memberName;

                    const maskedName = memberName
                      ? memberName.length <= 2
                        ? `${memberName[0]}*`
                        : `${memberName[0]}${"*".repeat(
                            memberName.length - 2,
                          )}${memberName.slice(-1)}`
                      : "-";

                    return (
                      <tr
                        key={reservation.reservationId}
                        className="h-[58px] transition-colors hover:bg-gray-50"
                      >
                        <td className="px-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                              isCanceled
                                ? "bg-red-50 text-red-600"
                                : reservation.reservationStatus === "PENDING"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isCanceled
                                  ? "bg-red-500"
                                  : reservation.reservationStatus === "PENDING"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                            />
                            {isCanceled
                              ? "취소 완료"
                              : reservation.reservationStatus === "PENDING"
                                ? "예약 대기"
                                : "예약 완료"}
                          </span>
                        </td>

                        <td className="truncate px-2 text-gray-500">
                          {reservation.reservationId}
                        </td>

                        <td className="truncate px-2 text-gray-500">
                          {reservation.reservationOrderId}
                        </td>

                        <td
                          className="px-3 text-left font-medium text-gray-800"
                          title={reservation.exhibitionTitle}
                        >
                          <div className="line-clamp-2 break-words">
                            {reservation.exhibitionTitle}
                          </div>
                        </td>

                        <td className="truncate px-2 text-gray-700">
                          {maskedName}
                        </td>

                        <td className="whitespace-nowrap px-2 text-gray-500">
                          {reservation.memberPhone?.replace(
                            /-(\d{3,4})-/,
                            "-****-",
                          ) ?? "-"}
                        </td>

                        <td className="whitespace-nowrap px-2 text-gray-600">
                          {reservation.reservationDay}
                        </td>

                        <td className="whitespace-nowrap px-2 text-gray-600">
                          {reservation.reservationPerson}명
                        </td>

                        <td className="whitespace-nowrap px-2 font-semibold tabular-nums text-gray-800">
                          {Number(reservation.reservationAmount).toLocaleString(
                            "ko-KR",
                          )}
                          원
                        </td>

                        <td className="whitespace-nowrap px-2 text-xs text-gray-500">
                          {reservation.reservationCreatedAt?.slice(0, 10) ??
                            "-"}
                        </td>

                        <td className="whitespace-nowrap px-2 text-xs text-gray-500">
                          {reservation.reservationCanceledAt?.slice(0, 10) ??
                            "-"}
                        </td>

                        <td className="px-2">
                          {isCanceled ? (
                            <span className="text-xs text-gray-400">
                              처리 완료
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCancel(reservation)}
                              disabled={isCanceling}
                              className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isCanceling ? "취소 중..." : "예약 취소"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 페이지네이션 */}
        <div className="flex min-h-[64px] flex-wrap items-center justify-center gap-3 border-t border-gray-200 bg-white px-5 py-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!pageData.prev || loading}
              onClick={() => setPage(pageData.prevPage)}
              className="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              이전
            </button>

            {(pageData.pageNumberList ?? []).map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                disabled={loading}
                className={`h-8 min-w-8 rounded-md px-2.5 text-xs font-semibold transition ${
                  pageNumber === pageData.currentPage
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={!pageData.next || loading}
              onClick={() => setPage(pageData.nextPage)}
              className="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservationComponent;
