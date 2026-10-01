import { QRCodeSVG } from "qrcode.react";

/**
 * 티켓 입장용 공통 QR 코드 컴포넌트
 * @param {string} reservationNo - 예약/예매 번호
 * @param {number} size - QR 코드 크기 (기본값: 96)
 */
const TicketQRCode = ({ reservationNo, size = 96 }) => {
  if (!reservationNo) return null;

  // 💡 출처 및 예약번호를 담은 최소한의 JSON 데이터 생성
  const qrPayload = JSON.stringify({
    iss: "ARTICKET",
    reservationNo: reservationNo,
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] text-gray-400 font-medium">
        현장 입장을 위한 QR 코드
      </span>
      <div className="p-2 border border-gray-100 rounded-lg bg-white shadow-inner flex items-center justify-center">
        <QRCodeSVG
          value={qrPayload}
          size={size}
          bgColor={"#FFFFFF"}
          fgColor={"#000000"}
          level={"M"}
        />
      </div>
    </div>
  );
};

export default TicketQRCode;