import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
        
        {/* 상단 타이틀 */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-1">
            <svg className="w-7 h-7 text-amber-600 -rotate-45" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 10V6a2 2 0 0 0-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.97-2 3.46s.81 2.77 2 3.46V18H4v-1.54c1.19-.69 2-1.97 2-3.46 0-1.49-.81-2.77-2-3.46V6h16v2.54z"/>
            </svg>
            <h1 className="text-2xl font-extrabold tracking-wider text-amber-600">ARTICKET</h1>
          </div>
          <p className="text-xs text-gray-400 font-semibold tracking-widest">RESERVATION RECEIPT</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">NO. XXXXXXXX</p>
        </div>

        {/* 점선 구분선 */}
        <div className="border-t border-dashed border-gray-300 my-4"></div>

        {/* 예약 정보 리스트 */}
        <div className="space-y-4 text-sm text-gray-700 py-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">전시명</span>
            <span className="font-semibold text-gray-900">카우스 친구, 그리고 이웃</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">장소</span>
            <span className="font-semibold text-gray-900">한가람 미술관 1층</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">관람일시</span>
            <span className="font-semibold text-gray-900">2026.09.20 11:00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">예약인원</span>
            <span className="font-semibold text-gray-900">3명</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">예매일자</span>
            <span className="font-semibold text-gray-900">2026.09.15 14:30</span>
          </div>
        </div>

        {/* 실선 구분선 */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* 예약 상태 (성공) */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-400 text-sm">예약상태</span>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-sm bg-emerald-400">
            예약완료
          </span>
        </div>

        {/* QR 코드 영역 */}
        <div className="border-t border-dashed border-gray-300 my-4"></div>
        <div className="text-center my-4">
          <p className="text-xs text-gray-400 mb-3">현장 입장을 위한 QR 코드</p>
          <div className="inline-block p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="w-32 h-32 bg-gray-900 mx-auto flex items-center justify-center text-white text-xs">
              [QR CODE]
            </div>
          </div>
        </div>

        {/* 하단 점선 및 버튼 */}
        <div className="border-t border-dashed border-gray-300 my-4"></div>
        <button 
          onClick={() => alert('상세 페이지로 이동')}
          className="w-full mt-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-md transition-colors text-sm"
        >
          상세 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;