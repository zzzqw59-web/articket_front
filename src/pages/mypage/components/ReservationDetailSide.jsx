import Badge from "../../../components/common/Badge";

const ReservationDetailSide = ({ data, type = "booking", onClose }) => {
  if (!data) return null;

  const isCanceled = data.status.includes("취소");
  const isPayment = type === "payment";

  return (
    <div className="w-[360px] flex flex-col gap-4 sticky top-20 h-fit shrink-0">
      {/* 영수증 카드 */}
      <div className="relative w-full bg-white border border-gray-100 rounded-lg shadow-sm p-6 overflow-hidden">
        {/* 1. 취소 워터마크 (CANCELED) */}
        {isCanceled && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-15deg]">
            <span className="text-8xl font-black text-red-500 tracking-tight">
              CANCELED
            </span>
          </div>
        )}

        {/* 2. 헤더 */}
        <div className="flex flex-col items-center gap-1 border-b border-gray-100 pb-4 mb-4 text-center">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold text-base">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
            <span>ARTICKET</span>
          </div>
          <span className="text-[10px] text-gray-400 tracking-wider">
            {isPayment ? "PAYMENT DETAILS" : "RESERVATION RECEIPT"}
          </span>
          <span className="text-[11px] text-gray-500">
            NO. {data.bookingId || data.transactionId}
          </span>
        </div>

        {/* 3. 상세 항목 리스트 */}
        <div className="flex flex-col gap-2.5">
          <DetailItem label="전시명" value={data.title} />

          {/* 예약 전용 항목 */}
          {!isPayment && (
            <>
              <DetailItem label="장소" value={data.place} />
              <DetailItem label="관람일시" value={data.viewDate} />
              <DetailItem label="예약인원" value={data.personnel} />
              <DetailItem label="예매일자" value={data.bookingDate} />
            </>
          )}

          {/* 결제 전용 항목 */}
          {isPayment && (
            <>
              <DetailItem label="거래번호" value={data.transactionId} />
              <DetailItem label="예약번호" value={data.bookingId} />
              <DetailItem label="결제 금액" value={data.amount} isPrice />
              <DetailItem label="결제일시" value={data.transactionDate} />
            </>
          )}

          {/* 상태 및 취소일시 */}
          <div className="flex justify-between items-start text-xs pt-1">
            <span className="text-gray-400 pt-1">
              {isPayment ? "결제 상태" : "예약 상태"}
            </span>
            <div className="flex flex-col items-end gap-1">
              <Badge
                label={data.status}
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

        {/* 4. 하단 영역 (예약/결제 및 취소 여부에 따른 분기) */}
        <div className="border-t border-gray-100 mt-5 pt-5 flex flex-col items-center gap-3">
          {/* A. 정상 예약 건: QR 코드 표출 */}
          {!isPayment && !isCanceled && (
            <>
              <span className="text-[11px] text-gray-400">
                현장 입장을 위한 QR 코드
              </span>
              <div className="w-24 h-24 p-1.5 border border-gray-100 rounded bg-white flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${data.bookingId}`}
                  alt="입장 QR 코드"
                  className="w-full h-full"
                />
              </div>
            </>
          )}

          {/* B. 취소된 예약 건 */}
          {!isPayment && isCanceled && (
            <span className="text-[11px] text-gray-400 py-2">
              예약 취소 완료된 티켓입니다.
            </span>
          )}

          {/* C. 결제 내역 (취소 여부 상관없이 단순 하단 안냇글) */}
          {isPayment && (
            <span className="text-[11px] text-gray-400 py-1">
              {isCanceled ? "결제 취소가 완료되었습니다." : "정상 처리된 결제건입니다."}
            </span>
          )}
        </div>
      </div>

      {/* 5. 하단 버튼 */}
      <div className="flex flex-col gap-2">
        {!isCanceled && (
          <button className="w-full py-2 bg-amber-600 text-white text-xs font-bold rounded hover:bg-amber-700 transition-colors">
            {isPayment ? "결제 취소" : "예약 취소"}
          </button>
        )}
        <button
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
    <span className="text-gray-400 whitespace-nowrap">{label}</span>
    <span className={`text-gray-900 ${isPrice ? "font-bold text-sm text-amber-700" : ""}`}>
      {value}
    </span>
  </div>
);

export default ReservationDetailSide;