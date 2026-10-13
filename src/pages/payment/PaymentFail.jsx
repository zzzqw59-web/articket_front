import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getReservationByOrderId } from "../../api/reservationApi";

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!orderId) {
          setIsLoading(false);
          return;
        }

        const data = await getReservationByOrderId(orderId);

        console.log("실패 예약 상세 정보:", data);

        setReservation(data);
      } catch (error) {
        console.error("예약 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [orderId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">

        {/* 상단 타이틀 */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-1">
            <svg
              className="w-7 h-7 text-amber-600 -rotate-45"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 10V6a2 2 0 0 0-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99 2 2 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.81-2.77-2-3.46V6h16v2.54z"
              />
            </svg>

            <h1 className="text-2xl font-extrabold tracking-wider text-amber-600">
              ARTICKET
            </h1>
          </div>

          <p className="text-xs text-gray-400 font-semibold tracking-widest">
            RESERVATION RECEIPT
          </p>

          <p className="text-xs text-gray-400 font-medium mt-0.5">
            NO. {orderId || "XXXXXXXX"}
          </p>
        </div>

        {/* 점선 구분선 */}
        <div className="border-t border-dashed border-gray-300 my-4"></div>

        {/* 예약 정보 */}
        <div className="space-y-4 text-sm text-gray-700 py-2">

          {/* 전시명 */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-400 shrink-0">
              전시명
            </span>

            <span className="font-semibold text-gray-900 text-right">
              {reservation?.exhibitionTitle || "-"}
            </span>
          </div>

          {/* 장소 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              장소
            </span>

            <span className="font-semibold text-gray-900">
              {reservation?.exhibitionArea || "-"}
            </span>
          </div>

          {/* 관람일시 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              관람일시
            </span>

            <span className="font-semibold text-gray-900">
              {reservation?.reservationDay || "-"}
            </span>
          </div>

          {/* 예약인원 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              예약인원
            </span>

            <span className="font-semibold text-gray-900">
              {reservation?.reservationPerson
                ? `${reservation.reservationPerson}명`
                : "-"}
            </span>
          </div>

          {/* 예매일자 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              예매일자
            </span>

            <span className="font-semibold text-gray-900">
              {reservation?.reservationCreatedAt
                ? reservation.reservationCreatedAt
                    .replace("T", " ")
                    .slice(0, 16)
                : "-"}
            </span>
          </div>
        </div>

        {/* 실패 메시지 */}
        {message && (
          <>
            <div className="border-t border-gray-200 my-4"></div>

            <div className="text-center text-sm text-gray-500 py-2">
              {message}
            </div>
          </>
        )}

        {/* 예약 상태 */}
        <div className="border-t border-gray-200 my-4"></div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-400 text-sm">
            예약상태
          </span>

          <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-sm bg-red-500">
            예약실패
          </span>
        </div>

        {/* 하단 점선 */}
        <div className="border-t border-dashed border-gray-300 my-4"></div>

        {/* 버튼 */}
        <button
          onClick={() => navigate(`/articket/exhibition/${reservation.exhibitionId}`)}
          className="w-full mt-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-md transition-colors text-sm"
        >
          상세페이지로 이동
        </button>

      </div>
    </div>
  );
};

export default PaymentFail;
