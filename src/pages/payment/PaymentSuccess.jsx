import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPayment } from "../../api/paymentApi";
import { getReservationDetail } from "../../api/reservationApi";
import TicketQRCode from "../../components/common/TicketQRCode";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState(null);

  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // React StrictMode 중복 결제 승인 방지
  const confirmStarted = useRef(false);

  useEffect(() => {
    if (confirmStarted.current) {
      return;
    }

    confirmStarted.current = true;

    const handlePaymentConfirm = async () => {
      try {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        console.log("결제 승인 요청:", {
          paymentKey,
          orderId,
          amount,
        });

        if (!paymentKey || !orderId || !amount) {
          throw new Error("결제 정보가 올바르지 않습니다.");
        }

        const response = await confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        console.log("결제 승인 완료:", response);

        const reservationResponse = await getReservationDetail(
          response.reservationId
        );

        console.log("예약 상세 정보:", reservationResponse);

        setPayment(response);
        setReservation(reservationResponse);
      } catch (error) {
        console.error("결제 승인 실패 전체:", error);
        console.error("error.response:", error.response);
        console.error("error.message:", error.message);

        setError(
          error.response?.data?.message ||
            error.message ||
            "결제 승인에 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentConfirm();
  }, [searchParams]);

  // =====================================================
  // 로딩
  // =====================================================
  if (isLoading) {
    return (
      <main className="min-h-[600px] flex items-center justify-center bg-white">
        <p className="text-sm text-gray-400">
          결제를 확인하는 중입니다...
        </p>
      </main>
    );
  }

  // =====================================================
  // 결제 실패
  // =====================================================
  if (error) {
    return (
      <main className="min-h-[600px] flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-xl text-center">
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-5">
            ARTICKET
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            결제 승인에 실패했습니다.
          </h2>

          <p className="text-sm text-gray-500 break-keep mb-8">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/articket")}
            className="w-full max-w-sm h-12 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
          >
            전시회관으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // 결제 완료
  // =====================================================
  return (
    <main className="min-h-[600px] bg-white flex justify-center px-6 py-12 md:py-16">
      <div className="w-full max-w-[520px]">
        {/* 예약 영수증 */}
        <div className="bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
          {/* ===============================================
              상단
          =============================================== */}
          <div className="px-8 pt-8 pb-5">
            <div className="text-center">
              {/* ARTICKET */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">
                  🎟
                </span>

                <span className="text-3xl font-bold text-[#e27800]">
                  ARTICKET
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-2 tracking-[0.15em]">
                RESERVATION RECEIPT
              </p>

              <p className="text-xs text-gray-400 mt-2">
                NO. {payment?.orderId || "XXXXXXXX"}
              </p>
            </div>

            <div className="border-t border-dashed border-gray-300 mt-5" />
          </div>

          {/* ===============================================
              예약 정보
          =============================================== */}
          <div className="px-8">
            {/* 전시명 */}
            <div className="flex justify-between items-center gap-6 py-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                전시명
              </span>

              <span className="text-sm font-semibold text-gray-800 text-right">
                {reservation?.exhibitionTitle || "-"}
              </span>
            </div>

            {/* 장소 */}
            <div className="flex justify-between items-center gap-6 py-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                장소
              </span>

              <span className="text-sm font-semibold text-gray-800 text-right">
                {reservation?.exhibitionArea || "-"}
              </span>
            </div>

            {/* 관람일 */}
            <div className="flex justify-between items-center gap-6 py-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                관람일시
              </span>

              <span className="text-sm font-semibold text-gray-800 text-right">
                {reservation?.reservationDay || "-"}
              </span>
            </div>

            {/* 예약 인원 */}
            <div className="flex justify-between items-center gap-6 py-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                예약인원
              </span>

              <span className="text-sm font-semibold text-gray-800 text-right">
                {reservation?.reservationPerson
                  ? `${reservation.reservationPerson}명`
                  : "-"}
              </span>
            </div>

            {/* 결제 금액 */}
            <div className="flex justify-between items-center gap-6 py-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                결제금액
              </span>

              <span className="text-lg font-bold text-gray-900 text-right">
                {payment?.totalAmount != null
                  ? `${payment.totalAmount.toLocaleString()}원`
                  : "-"}
              </span>
            </div>

            {/* 예매일자 */}
            <div className="flex justify-between items-center gap-6 py-4">
              <span className="text-sm text-gray-500">
                예매일자
              </span>

              <span className="text-sm font-semibold text-gray-800 text-right">
                {payment?.approvedAt
                  ? payment.approvedAt.replace("T", " ").slice(0, 16)
                  : "-"}
              </span>
            </div>
          </div>

          {/* ===============================================
              예약 상태
          =============================================== */}
          <div className="px-8">
            <div className="border-t border-dashed border-gray-300 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  예약상태
                </span>

                <span className="px-3 py-1.5 rounded-md bg-green-100 text-green-600 text-xs font-semibold">
                  {reservation?.reservationStatus === "RESERVED"
                    ? "예약완료"
                    : reservation?.reservationStatus || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* ===============================================
              QR
          =============================================== */}
          <div className="border-t border-dashed border-gray-300 px-8 py-7 text-center">
            <p className="text-sm text-gray-400 mb-4">
              현장 입장을 위한 QR 코드
            </p>

            <TicketQRCode
              reservationNo={payment?.orderId}
              size={180}
            />
          </div>

          {/* ===============================================
              상세 페이지 버튼
          =============================================== */}
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={() =>
                navigate(`/articket/exhibition/${reservation.exhibitionId}`)
              }
              className="w-full h-11 bg-[#e27800] text-white rounded-md text-sm font-semibold hover:bg-[#c96800] transition"
            >
              상세 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
