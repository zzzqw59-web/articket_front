import React, { useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";

const TicketQRCode = ({ reservationNo, size = 96 }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!reservationNo) return null;

  // QR 코드에 예약 확인 페이지 URL을 저장
  const qrPayload = `http://192.168.32.20:5173/articket/reservation/check/${reservationNo}`;

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] text-gray-400 font-medium">
          현장 입장을 위한 QR 코드
        </span>

        <div
          onClick={() => setIsOpen(true)}
          className="p-2 border border-gray-100 rounded-lg bg-white shadow-inner flex items-center justify-center cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group relative"
          title="클릭하여 확대하기"
        >
          <QRCodeSVG
            value={qrPayload}
            size={size}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="M"
          />

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
            <span className="text-[10px] font-bold text-amber-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
              🔍 확대
            </span>
          </div>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-sm w-full flex flex-col items-center gap-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="text-center mt-2">
                <h4 className="text-base font-bold text-gray-900">
                  현장 입장 QR 코드
                </h4>

                <p className="text-xs text-amber-600 font-semibold mt-0.5 break-all">
                  NO. {reservationNo}
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-inner my-2">
                <QRCodeSVG
                  value={qrPayload}
                  size={220}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                />
              </div>

              <p className="text-xs text-gray-400 text-center">
                입장 시 모바일 기기의 화면을 검표원에게 보여주세요.
              </p>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TicketQRCode;
