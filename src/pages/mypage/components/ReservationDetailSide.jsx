import Badge from "../../../components/common/Badge";
import TicketQRCode from "../../../components/common/TicketQRCode";
import {
  RESERVATION_STATUS,
  PAYMENT_STATUS,
  STATUS_CONFIG,
} from "../../../constants/mypageConstants";

const ReservationDetailSide = ({
  data,
  type = "booking",
  onClose,
  onOpenCancelModal,
}) => {
  if (!data) return null;

  const isPayment = type === "payment";

  // 예약 상태와 결제 상태를 구분
  const reservationStatus = data.reservationStatus ?? data.status;
  const paymentStatus = data.paymentStatus ?? data.status;

  const currentStatus = isPayment ? paymentStatus : reservationStatus;

  // 취소 여부 확인
  const isCanceled = isPayment
    ? paymentStatus === PAYMENT_STATUS.CANCELED
    : reservationStatus === RESERVATION_STATUS.CANCELED;

  // 예약 번호
  const reservationNo =
    data.reservationOrderId ||
    data.bookingId ||
    data.transactionId;

  // 상태 설정
  const currentConfig = isPayment
    ? STATUS_CONFIG.PAYMENT[paymentStatus]
    : STATUS_CONFIG.RESERVATION[reservationStatus];

  // 안내 메시지
  const statusMessage =
    currentConfig?.message ||
    (isPayment
      ? "결제 처리 중입니다."
      : "예약 처리 중입니다.");

  // 예약 확정 여부
  const isReserved =
    !isPayment &&
    reservationStatus === RESERVATION_STATUS.RESERVED;

  return (
    <div className="w-[360px] flex flex-col gap-4 sticky top-20 h-fit shrink-0">
      {/* 영수증 카드 */}
      <div className="relative w-full bg-white border border-gray-100 rounded-lg shadow-sm p-6 overflow-hidden">
        {/* 취소 워터마크 */}
        {isCanceled && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-15deg]">
            <span className="text-8xl font-black text-red-500 tracking-tight">
              CANCELED
            </span>
          </div>
        )}

        {/* 헤더 */}
        <div className="flex flex-col items-center gap-1 border-b border-gray-100 pb-4 mb-4 text-center">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold text-base">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8h-7.6l2.4-7.2-6-4.8h7.6z" />
            </svg>
            <span>ARTICKET</span>
          </div>

          <span className="text-[10px] text-gray-400 tracking-wider">
            {isPayment
              ? "PAYMENT DETAILS"
              : "RESERVATION RECEIPT"}
          </span>

          <span className="text-[11px] text-gray-500 break-all">
            NO. {reservationNo}
          </span>
        </div>

        {/* 상세 항목 */}
        <div className="flex flex-col gap-2.5">
          <DetailItem
            label="전시명"
            value={data.title ?? data.exhibitionTitle}
          />

          {!isPayment && (
            <>
              <DetailItem
                label="장소"
                value={data.place ?? data.exhibitionArea}
              />

              <DetailItem
                label="관람일시"
                value={data.viewDate ?? data.reservationDay}
              />

              <DetailItem
                label="예약인원"
                value={
                  data.personnel != null
                    ? data.personnel
                    : data.reservationPerson != null
                      ? `${data.reservationPerson}명`
                      : "-"
                }
              />

              <DetailItem
                label="예매일자"
                value={
                  data.bookingDate ??
                  data.reservationCreatedAt
                }
              />
            </>
          )}

          {isPayment && (
            <>
              <DetailItem
                label="거래번호"
                value={data.transactionId}
              />

              <DetailItem
                label="예약번호"
                value={data.bookingId ?? data.reservationOrderId}
              />

              <DetailItem
                label="결제 금액"
                value={data.amount}
                isPrice
              />

              <DetailItem
                label="결제일시"
                value={data.transactionDate}
              />
            </>
          )}

          {/* 상태 및 취소일시 */}
          <div className="flex justify-between items-start text-xs pt-1">
            <span className="text-gray-400 pt-1">
              {isPayment ? "결제 상태" : "예약 상태"}
            </span>

            <div className="flex flex-col items-end gap-1">
              <Badge
                label={currentConfig?.label || currentStatus || "-"}
                variant={isCanceled ? "ended" : "ongoing"}
              />

              {isCanceled && data.cancelDate && (
                <span className="text-[11px] text-red-500">
                  {data.cancelDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 하단 영역: 확정 예약만 QR 표시 */}
        <div className="border-t border-gray-100 mt-5 pt-5 flex flex-col items-center gap-3">
          {isReserved && (
            <TicketQRCode
              reservationNo={reservationNo}
              reservationStatus={reservationStatus}
              size={96}
            />
          )}

          {!isPayment && reservationStatus === RESERVATION_STATUS.PENDING && (
            <span className="text-[11px] text-amber-600 py-1">
              결제가 완료되면 QR 코드가 표시됩니다.
            </span>
          )}

          {(isCanceled || isPayment) && (
            <span className="text-[11px] text-gray-400 py-1">
              {statusMessage}
            </span>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col gap-2">
        {!isCanceled && !isPayment && (
          <button
            type="button"
            onClick={onOpenCancelModal}
            className="w-full py-2 bg-amber-600 text-white text-xs font-bold rounded hover:bg-amber-700 transition-colors"
          >
            예약 취소
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, isPrice = false }) => (
  <div className="flex justify-between items-baseline gap-2 text-xs">
    <span className="text-gray-400 whitespace-nowrap">
      {label}
    </span>

    <span
      className={`text-gray-900 ${
        isPrice ? "font-bold text-sm text-amber-700" : ""
      }`}
    >
      {value ?? "-"}
    </span>
  </div>
);

export default ReservationDetailSide;