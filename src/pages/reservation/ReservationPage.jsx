import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createReservation } from "../../api/reservationApi";

const ReservationPage = () => {
  const { exhibitionId } = useParams();

  // 임시 전시 데이터
  // TODO: 추후 getExhibitionDetail() API 데이터로 교체
  const exhibition = {
    id: Number(exhibitionId),
    title: "카우스 친구, 그리고 이웃",
    englishTitle: "KAWS",
    startDate: "2026-07-23",
    endDate: "2026-12-27",
    ticketPrice: 7000,
  };

  // 오늘 날짜
  const today = new Date();

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 예약 가능한 첫 날짜
  const firstAvailableDate =
    todayString > exhibition.startDate
      ? todayString
      : exhibition.startDate;

  // 인원수
  const [count, setCount] = useState(1);

  // 결제 처리 상태
  const [isLoading, setIsLoading] = useState(false);

  // 현재 달
  const [currentYear, setCurrentYear] = useState(
    Number(firstAvailableDate.substring(0, 4))
  );

  const [currentMonth, setCurrentMonth] = useState(
    Number(firstAvailableDate.substring(5, 7))
  );

  // 선택한 관람일
  const [selectedDate, setSelectedDate] = useState(
    firstAvailableDate
  );

  // 최대 예약 인원
  const maxCount = 10;

  // 총 금액
  const totalPrice = exhibition.ticketPrice * count;

  // 선택된 날짜 표시용
  const formattedSelectedDate =
    selectedDate.replaceAll("-", ".");

  // -----------------------------
  // 인원수
  // -----------------------------

  const handleDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleIncrease = () => {
    if (count < maxCount) {
      setCount(count + 1);
    }
  };

  // -----------------------------
  // 달력
  // -----------------------------

  const handlePrevMonth = () => {
    const [startYear, startMonth] = exhibition.startDate
      .split("-")
      .map(Number);

    // 전시 시작 월보다 이전으로 이동하지 못하게 함
    if (
      currentYear === startYear &&
      currentMonth === startMonth
    ) {
      return;
    }

    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const [endYear, endMonth] = exhibition.endDate
      .split("-")
      .map(Number);

    // 전시 종료 월보다 이후로 이동하지 못하게 함
    if (
      currentYear === endYear &&
      currentMonth === endMonth
    ) {
      return;
    }

    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 해당 월의 총 일수
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // 해당 날짜가 예약 가능한지 확인
  const isAvailableDate = (date) => {
    return (
      date >= exhibition.startDate &&
      date <= exhibition.endDate &&
      date >= todayString
    );
  };

  const totalDays = getDaysInMonth(
    currentYear,
    currentMonth
  );

  // 해당 월 1일의 요일
  // 일요일 = 0
  // 월요일 = 1
  // ...
  // 토요일 = 6
  const firstDay = new Date(
    currentYear,
    currentMonth - 1,
    1
  ).getDay();

  // -----------------------------
  // 결제
  // -----------------------------

  const handlePayment = async () => {
    if (isLoading) {
      return;
    }

    if (!exhibitionId) {
      alert("전시 정보를 확인할 수 없습니다.");
      return;
    }

    if (!selectedDate) {
      alert("관람일을 선택해주세요.");
      return;
    }

    if (count < 1) {
      alert("관람 인원을 확인해주세요.");
      return;
    }

    const reservationData = {
      exhibitionId: exhibition.id,
      reservationPerson: count,
      reservationDay: selectedDate,
    };

    setIsLoading(true);

    try {
      console.log("예약 요청 데이터:", reservationData);

      // DB 데이터 준비되면 여기서 실제 API 호출
      // const result = await createReservation(reservationData);

      // console.log("예약 생성 결과:", result);

    } catch (error) {
      console.error("예약 생성 실패:", error);
      alert("예약 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-stone-200">

        {/* ========================================
            왼쪽 : 전시 정보
        ======================================== */}

        <div className="md:w-1/2 bg-gradient-to-br from-[#1b2a4a] via-[#4a1c2d] to-[#7b1828] p-10 text-white flex flex-col justify-between relative min-h-[480px]">

          <div className="space-y-1.5 z-10">

            <div className="inline-block bg-white text-black font-black text-xl px-2.5 py-0.5 rounded-sm shadow">
              카우스
            </div>

            <p className="text-xs font-bold tracking-wider opacity-90">
              FRIENDS AND NEIGHBORS
            </p>

            <p className="text-xs font-bold opacity-90">
              친구, 그리고 이웃
            </p>

          </div>

          <div className="mt-auto z-10">

            <div className="flex items-center text-lg font-bold tracking-wide">

              <span>
                {exhibition.startDate.replaceAll("-", ".")}
              </span>

              <span className="tracking-widest mx-2 text-xs opacity-60">
                •••••
              </span>

              <span>
                {exhibition.endDate.substring(5).replace("-", ".")}
              </span>

            </div>

            <h2 className="text-6xl font-black leading-none tracking-tighter mt-2 drop-shadow-md">
              {exhibition.englishTitle}
            </h2>

          </div>
        </div>

        {/* ========================================
            오른쪽 : 예약 정보
        ======================================== */}

        <div className="md:w-1/2 p-8 bg-white flex flex-col justify-between">

          {/* 예약 정보 */}

          <div className="space-y-5">

            {/* 전시 제목 */}

            <h2 className="text-xl font-extrabold text-stone-900 border-b border-stone-100 pb-3">
              {exhibition.title}
            </h2>

            {/* 관람일 */}

            <div className="flex justify-between items-center text-sm">

              <span className="text-stone-400 font-medium">
                관람일
              </span>

              <span className="font-semibold text-stone-800">
                {formattedSelectedDate}
              </span>

            </div>

            {/* 인원수 */}

            <div className="flex justify-between items-center text-sm">

              <span className="text-stone-400 font-medium">
                인원수
              </span>

              <div className="flex items-center space-x-3">

                {/* 감소 */}

                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={count <= 1}
                  className={`w-6 h-6 flex items-center justify-center font-bold transition-colors ${
                    count <= 1
                      ? "text-stone-300 cursor-not-allowed"
                      : "text-stone-600 hover:text-stone-900 cursor-pointer"
                  }`}
                >
                  -
                </button>

                {/* 현재 인원 */}

                <span className="font-bold text-stone-900 w-6 text-center">
                  {count}명
                </span>

                {/* 증가 */}

                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={count >= maxCount}
                  className={`w-6 h-6 flex items-center justify-center font-bold transition-colors ${
                    count >= maxCount
                      ? "text-stone-300 cursor-not-allowed"
                      : "text-stone-600 hover:text-stone-900 cursor-pointer"
                  }`}
                >
                  +
                </button>

              </div>

            </div>

            {/* 총 금액 */}

            <div className="flex justify-between items-center text-sm pt-2">

              <span className="text-stone-400 font-medium">
                총 금액
              </span>

              <span className="text-lg font-extrabold text-stone-900">
                {totalPrice.toLocaleString()}원
              </span>

            </div>

          </div>

          {/* ========================================
              달력
          ======================================== */}

          <div className="bg-[#2b2b2b] text-white rounded-xl p-4 my-6 shadow-inner">

            {/* 달력 헤더 */}

            <div className="flex justify-between items-center text-sm font-bold mb-3 px-1">

              <span>
                {currentYear}년 {currentMonth}월
              </span>

              <div className="flex space-x-3 text-xs">

                {/* 이전 달 */}

                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="hover:text-white cursor-pointer px-1"
                >
                  ▲
                </button>

                {/* 다음 달 */}

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="hover:text-white cursor-pointer px-1"
                >
                  ▼
                </button>

              </div>

            </div>

            {/* 요일 */}

            <div className="grid grid-cols-7 text-center text-xs gap-y-2.5">

              {[
                "일",
                "월",
                "화",
                "수",
                "목",
                "금",
                "토",
              ].map((day, idx) => (
                <span
                  key={idx}
                  className="text-stone-400 font-medium mb-1"
                >
                  {day}
                </span>
              ))}

              {/* 1일 이전 빈 공간 */}

              {Array.from({
                length: firstDay,
              }).map((_, index) => (
                <span key={`empty-${index}`} />
              ))}

              {/* 날짜 */}

              {Array.from(
                { length: totalDays },
                (_, i) => i + 1
              ).map((day) => {

                const date = `${currentYear}-${String(
                  currentMonth
                ).padStart(2, "0")}-${String(day).padStart(
                  2,
                  "0"
                )}`;

                const isSelected =
                  selectedDate === date;

                const isAvailable =
                  isAvailableDate(date);

                return (
                  <span
                    key={day}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedDate(date);
                      }
                    }}
                    className={`h-7 w-7 flex items-center justify-center mx-auto rounded-full transition-all ${
                      isSelected
                        ? "bg-sky-400 text-stone-950 font-bold shadow"
                        : isAvailable
                        ? "hover:bg-stone-700 text-stone-200 cursor-pointer"
                        : "text-stone-600 cursor-not-allowed"
                    }`}
                  >
                    {day}
                  </span>
                );
              })}

            </div>
          </div>

          {/* ========================================
              결제 버튼
          ======================================== */}

          <button
            type="button"
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full bg-[#f99b11] hover:bg-[#e0880e] text-white font-bold py-3.5 px-4 rounded-xl transition-colors text-center shadow-md ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isLoading ? "처리 중..." : "결제하기"}
          </button>

        </div>
      </div>
    </main>
  );
};

export default ReservationPage;
