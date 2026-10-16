
import React from "react";
import { Link } from "react-router-dom";

import MainHeadComponent from "../../components/main/MainHeadComponent";
import MainBannerComponent from "../../components/main/MainBannerComponent";
import MainPostersComponent from "../../components/main/MainPostersComponent";
import MainAskComponent from "../../components/main/MainAskComponent";
import MainReviewComponent from "../../components/main/MainReviewComponent";

const SectionTitle = ({ eyebrow, title, description, to, linkText }) => {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[#DED8CE] pb-6">
      <div>
        <p className="mb-3 text-[11px] font-medium tracking-[0.3em] text-[#938B81]">
          {eyebrow}
        </p>

        <h2 className="text-[30px] font-semibold tracking-[-0.045em] text-[#24211D] md:text-[38px]">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-[14px] leading-7 text-[#817A71]">
            {description}
          </p>
        )}
      </div>

      {to && (
        <Link
          to={to}
          className="group inline-flex items-center gap-3 pb-1 text-[13px] text-[#514B44] transition-colors hover:text-black"
        >
          {linkText || "전체보기"}

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
};

const MainPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* 01. 메인 비주얼 */}
      <MainHeadComponent />

      {/* 02. 화제의 전시 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16">
          <SectionTitle
            eyebrow="NOW EXHIBITION"
            title="지금, 주목할 전시"
            description="당신의 일상에 새로운 영감을 더할 전시를 만나보세요."
            to="/articket/exhibition"
          />

          <MainPostersComponent />
        </div>
      </section>

      {/* 03. 전시장 배너 */}
      <section className="bg-[#F0ECE5] py-8 md:py-12">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16">
          <MainBannerComponent />
        </div>
      </section>

      {/* 04. 커뮤니티 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16">
          <div className="mb-12">
            <p className="mb-3 text-[11px] font-medium tracking-[0.3em] text-[#938B81]">
              ARTICKET COMMUNITY
            </p>

            <h2 className="text-[30px] font-semibold tracking-[-0.045em] text-[#24211D] md:text-[38px]">
              예술을 나누는 공간
            </h2>

            <p className="mt-3 text-[14px] leading-7 text-[#817A71]">
              전시에 관한 궁금증과 관람 경험을 함께 나눠보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* 질문 · 문의 */}
            <div className="min-w-0">
              <SectionTitle
                eyebrow="Q & A"
                title="질문 · 문의"
                to="/articket/ask"
              />

              <MainAskComponent />
            </div>

            {/* 관람 후기 */}
            <div className="min-w-0">
              <SectionTitle
                eyebrow="REVIEW"
                title="관람 후기"
                to="/articket/review"
              />

              <MainReviewComponent />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
