
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import main1 from "../../asset/main1.jpg";
import main2 from "../../asset/main2.jpg";
import main3 from "../../asset/main3.jpg";
import main4 from "../../asset/main4.jpg";

const slides = [
  {
    image: main1,
    title: ["예술이 일상이 되는 순간,", "당신의 아티켓"],
    description: [
      "전시를 더 가까이,",
      "지금 Articket에서 만나보세요.",
    ],
  },
  {
    image: main2,
    title: ["새로운 시선으로", "예술을 만나다"],
    description: [
      "익숙한 일상에서 발견하는",
      "특별한 전시의 순간.",
    ],
  },
  {
    image: main3,
    title: ["당신의 하루에", "예술을 더하다"],
    description: [
      "다양한 전시와 공간을",
      "아티켓에서 만나보세요.",
    ],
  },
  {
    image: main4,
    title: ["전시의 시작부터", "그 여운까지"],
    description: [
      "전시 탐색과 예약, 관람 후기까지",
      "하나의 공간에서 경험하세요.",
    ],
  },
];

const MainHeadComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // 이전 슬라이드
  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  // 다음 슬라이드
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="
        relative h-[620px] min-h-[500px]
        w-full overflow-hidden
        bg-[#26221D]
        md:h-[720px]
      "
      aria-label="아티켓 메인 비주얼"
    >
      {/* 배경 이미지 슬라이드 */}
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.image}
          alt=""
          aria-hidden="true"
          className={`
            absolute inset-0 h-full w-full
            object-cover object-center
            transition-opacity duration-1000
            ${
              index === currentIndex
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        />
      ))}

      {/* 왼쪽 그라데이션 */}
      <div
        className="
          absolute inset-0 z-10
          bg-gradient-to-r
          from-black/70
          via-black/35
          to-black/10
        "
      />

      {/* 하단 그라데이션 */}
      <div
        className="
          absolute inset-0 z-10
          bg-gradient-to-t
          from-black/35
          via-transparent
          to-transparent
        "
      />

      {/* 메인 콘텐츠 */}
      <div
        className="
          relative z-20
          mx-auto flex h-full
          w-full max-w-[1440px]
          flex-col justify-center
          px-6 pb-14
          md:px-12 lg:px-16
        "
      >
        {/* 영문 브랜드명 */}
        <div className="mb-7 flex items-center gap-4">
          <span className="h-px w-8 bg-white/80" />

          <p
            className="
              text-[11px] font-medium
              tracking-[0.45em]
              text-white/90
              md:text-[13px]
            "
          >
            ARTICKET
          </p>
        </div>

        {/* 메인 문구 */}
        <div
          key={currentIndex}
          className="max-w-[850px]"
        >
          <h1
            className="
              text-[38px] font-medium
              leading-[1.35]
              tracking-[-0.055em]
              text-white
              sm:text-[48px]
              md:text-[58px]
              lg:text-[68px]
            "
          >
            {currentSlide.title.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* 설명 */}
          <p
            className="
              mt-7 text-[14px]
              font-light leading-7
              text-white/85
              md:text-[17px] md:leading-8
            "
          >
            {currentSlide.description.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-10 flex flex-wrap items-center gap-4">

          {/* 전시 둘러보기 */}
          <Link
            to="/articket/exhibition"
            className="
              group inline-flex
              min-w-[210px]
              items-center justify-between
              gap-10
              border border-white
              bg-transparent
              px-6 py-4
              text-[13px] font-medium
              text-white
              transition-colors duration-300
              hover:bg-white
              hover:text-[#25211D]
            "
          >
            전시 둘러보기

            <span
              className="
                text-lg
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>

          {/* 아티켓 소개 */}
          <Link
            to="/articket/intro"
            className="
              group inline-flex
              items-center gap-3
              px-3 py-4
              text-[13px] text-white/90
              transition-colors duration-300
              hover:text-white
            "
          >
            아티켓 소개

            <span
              className="
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              ↗
            </span>
          </Link>
        </div>
      </div>

      {/* 슬라이드 하단 컨트롤 */}
      <div
        className="
          absolute bottom-8 left-6 right-6
          z-30 mx-auto
          flex max-w-[1312px]
          items-center justify-between
          md:bottom-10 md:left-12 md:right-12
          lg:left-16 lg:right-16
        "
      >
        {/* 슬라이드 번호 */}
        <div className="flex items-center gap-4 text-white">
          <span className="text-[13px] font-medium">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>

          {/* 진행 표시선 */}
          <div className="h-px w-14 bg-white/50">
            <div
              className="
                h-full bg-white
                transition-all duration-500
              "
              style={{
                width: `${
                  ((currentIndex + 1) / slides.length) * 100
                }%`,
              }}
            />
          </div>

          <span className="text-[12px] text-white/60">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* 이전 / 다음 버튼 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="이전 슬라이드"
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              border border-white/50
              text-xl text-white
              transition-colors duration-300
              hover:bg-white
              hover:text-[#25211D]
            "
          >
            ←
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="다음 슬라이드"
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              border border-white/50
              text-xl text-white
              transition-colors duration-300
              hover:bg-white
              hover:text-[#25211D]
            "
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainHeadComponent;
