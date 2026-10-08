import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createReservation } from "../../api/reservationApi";
import { getExhibitionDetail } from "../../api/exhibitionApi";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

const ReservationPage = () => {
  const { exhibitionId } = useParams();

  const [exhibition, setExhibition] = useState(null);
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const [selectedDate, setSelectedDate] = useState(null);

  // 전시 상세 정보 조회
  useEffect(() => {
  const fetchExhibition = async () => {
    try {
      setIsLoading(true);

      const data = await getExhibitionDetail(exhibitionId);

      console.log("전시 상세:", data);

      setExhibition(data);

      // 오늘 날짜
      const today = new Date();
      const todayString =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // 기본 선택 날짜
      let defaultDate = todayString;

      // 오늘이 전시 시작일보다 이전이면 전시 시작일
      if (data.startDate && todayString < data.startDate) {
        defaultDate = data.startDate;
      }

      // 오늘이 전시 종료일보다 이후이면 전시 시작일
      if (data.endDate && todayString > data.endDate) {
        defaultDate = data.startDate;
      }

      setSelectedDate(defaultDate);

      // 선택된 날짜 기준으로 달력 표시
      const selected = new Date(`${defaultDate}T00:00:00`);

      setCurrentYear(selected.getFullYear());
      setCurrentMonth(selected.getMonth());
    } catch (error) {
      console.error("전시 정보 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchExhibition();
}, [exhibitionId]);

  // 총 결제 금액
  const totalPrice = exhibition
    ? exhibition.ticketPrice * count
    : 0;

  // 해당 월의 마지막 날짜
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 해당 월의 첫 번째 요일
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // 이전 달
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 달
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 날짜 선택
  const handleDateSelect = (day) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    const selected = `${currentYear}-${month}-${date}`;

    // 전시 기간 밖이면 선택하지 않음
    if (
      exhibition?.startDate &&
      selected < exhibition.startDate
    ) {
      return;
    }

    if (
      exhibition?.endDate &&
      selected > exhibition.endDate
    ) {
      return;
    }

    setSelectedDate(selected);
  };

  // 예약하기
  const handlePayment = async () => {
    if (!selectedDate) {
      alert("관람 날짜를 선택해주세요.");
      return;
    }


    try {
      console.log("예약 전 선택 날짜:", selectedDate);
      const reservationData = {
        exhibitionId: exhibition.id,
        reservationPerson: count,
        reservationDay: selectedDate,
      };

      console.log("예약 요청:", reservationData);

      // 1. 서버에 예약 생성
      const response = await createReservation(reservationData);

      console.log("예약 생성:", response);

      // 2. 서버가 만들어준 주문번호와 결제금액 사용
      const orderId = response.reservationOrderId;
      const amount = response.reservationAmount;

      console.log("Toss orderId:", orderId);
      console.log("Toss amount:", amount);

      // 3. Toss Payments SDK
      const tossPayments = await loadTossPayments(
        import.meta.env.VITE_TOSS_CLIENT_KEY
      );

      const payment = tossPayments.payment({
        customerKey: `member-${response.reservationId}`,
      });

      // 4. 결제창 호출
      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: amount,
        },
        orderId: orderId,
        orderName: exhibition.title,
        successUrl: `${window.location.origin}/articket/payment/success`,
        failUrl: `${window.location.origin}/articket/payment/fail`,
      });

    } catch (error) {
      console.error("결제 요청 실패:", error);
      console.log("에러 전체:", error);
      console.log("에러 코드:", error?.code);
      console.log("에러 메시지:", error?.message);

      alert(`결제 요청에 실패했습니다.\n${error?.message || ""}`);
    }
  };

  // 로딩
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
        <p className="text-gray-400">전시 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 전시 정보가 없는 경우
  if (!exhibition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
        <p className="text-gray-400">
          전시 정보를 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];

  // 앞쪽 빈칸
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // 날짜
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-10">

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* =====================================================
              왼쪽 - 전시 정보
          ===================================================== */}
          <div className="bg-[#111111] text-white p-8 md:p-12">

            {/* 전시 이미지 */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-10 bg-[#222222] shadow-xl">

              {exhibition.imgUrl ? (
                <img
                  src={exhibition.imgUrl}
                  alt={exhibition.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  전시 이미지가 없습니다.
                </div>
              )}

            </div>

            {/* 브랜드 */}
            <div className="mb-8">

              <p className="text-sm tracking-[0.3em] text-gray-400 font-medium">
                ARTICKET
              </p>

              <p className="text-xs tracking-[0.2em] text-gray-500 mt-2">
                EXHIBITION
              </p>

            </div>

            {/* 제목 */}
            <div className="mb-10">

              <p className="text-sm text-gray-400 mb-3">
                전시 예약
              </p>

              <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight break-keep">
                {exhibition.title}
              </h2>

            </div>

            {/* 전시 정보 */}
            <div className="space-y-5 border-t border-white/10 pt-8">

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  전시 기간
                </p>

                <p className="text-sm text-gray-200">
                  {exhibition.startDate} ~ {exhibition.endDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  지역
                </p>

                <p className="text-sm text-gray-200">
                  {exhibition.area || "정보 없음"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  티켓 가격
                </p>

                <p className="text-lg font-semibold text-white">
                  {exhibition.ticketPrice?.toLocaleString()}원
                </p>
              </div>

            </div>

          </div>


          {/* =====================================================
              오른쪽 - 예약
          ===================================================== */}
          <div className="bg-white p-8 md:p-12">

            {/* 제목 */}
            <div className="mb-8">

              <p className="text-xs tracking-[0.2em] text-gray-400 mb-2">
                RESERVATION
              </p>

              <h3 className="text-2xl font-bold text-gray-900">
                관람 예약
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                관람 인원과 날짜를 선택해주세요.
              </p>

            </div>


            {/* =====================================================
                인원 선택
            ===================================================== */}
            <div className="mb-10">

              <div className="flex items-center justify-between mb-3">

                <div>
                  <p className="font-semibold text-gray-900">
                    관람 인원
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    1인 기준
                  </p>
                </div>

                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      setCount((prev) => Math.max(1, prev - 1))
                    }
                    className="w-10 h-10 text-gray-500 hover:bg-gray-100 transition"
                  >
                    −
                  </button>

                  <div className="w-12 text-center font-semibold text-gray-900">
                    {count}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCount((prev) => prev + 1)
                    }
                    className="w-10 h-10 text-gray-500 hover:bg-gray-100 transition"
                  >
                    +
                  </button>

                </div>

              </div>

            </div>


            {/* =====================================================
                날짜 선택
            ===================================================== */}
            <div className="mb-10">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <p className="font-semibold text-gray-900">
                    관람 날짜
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    방문하실 날짜를 선택해주세요.
                  </p>
                </div>

              </div>


              {/* 달력 */}
              <div className="border border-gray-200 rounded-2xl p-5">

                {/* 달력 헤더 */}
                <div className="flex items-center justify-between mb-5">

                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-9 h-9 rounded-full hover:bg-gray-100 transition text-gray-500"
                  >
                    ←
                  </button>

                  <p className="font-semibold text-gray-900">
                    {currentYear}년 {currentMonth + 1}월
                  </p>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-9 h-9 rounded-full hover:bg-gray-100 transition text-gray-500"
                  >
                    →
                  </button>

                </div>


                {/* 요일 */}
                <div className="grid grid-cols-7 mb-2">

                  {["일", "월", "화", "수", "목", "금", "토"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs text-gray-400 py-2"
                      >
                        {day}
                      </div>
                    )
                  )}

                </div>


                {/* 날짜 */}
                <div className="grid grid-cols-7 gap-y-1">

                  {calendarDays.map((day, index) => {

                    if (day === null) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="h-10"
                        />
                      );
                    }

                    const month = String(currentMonth + 1).padStart(
                      2,
                      "0"
                    );

                    const date = String(day).padStart(2, "0");

                    const dateString = `${currentYear}-${month}-${date}`;

                    const isSelected =
                      selectedDate === dateString;

                    const isBeforeStart =
                      exhibition.startDate &&
                      dateString < exhibition.startDate;

                    const isAfterEnd =
                      exhibition.endDate &&
                      dateString > exhibition.endDate;

                    const isDisabled =
                      isBeforeStart || isAfterEnd;

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleDateSelect(day)}
                        className={`
                          h-10 rounded-lg text-sm transition
                          ${
                            isSelected
                              ? "bg-black text-white font-semibold"
                              : isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}

                </div>

              </div>

            </div>


            {/* =====================================================
                결제 정보
            ===================================================== */}
            <div className="border-t border-gray-200 pt-6">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <p className="text-sm text-gray-500">
                    총 결제 금액
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {count}명 ×{" "}
                    {exhibition.ticketPrice?.toLocaleString()}원
                  </p>
                </div>

                <p className="text-2xl font-bold text-gray-900">
                  {totalPrice.toLocaleString()}원
                </p>

              </div>


              {/* 예약 버튼 */}
              <button
                type="button"
                onClick={handlePayment}
                className="w-full h-14 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg"
              >
                예약 및 결제하기
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                결제 진행 후 예약이 확정됩니다.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ReservationPage;