
import banner from "../../asset/banner.jpg";
import { Link } from "react-router-dom";

const MainBannerComponent = () => {
  return (
    <div className="w-full">
      <div
        className="
          relative min-h-[320px]
          overflow-hidden
          bg-[#302B26]
          md:min-h-[380px]
        "
      >
        {/* 배경 이미지 */}
        <img
          src={banner}
          alt="전시장 내부 풍경"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* 그라데이션 */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-black/75
            via-black/35
            to-black/5
          "
        />

        {/* 배너 콘텐츠 */}
        <div
          className="
            relative z-10
            flex min-h-[320px]
            flex-col justify-center
            px-7 py-12
            md:min-h-[380px]
            md:px-16 lg:px-20
          "
        >
          <p className="mb-5 text-[11px] tracking-[0.35em] text-white/75">
            EXPLORE ART SPACES
          </p>

          <h2
            className="
              text-[32px] font-medium
              leading-[1.4] tracking-[-0.05em]
              text-white
              md:text-[46px]
            "
          >
            예술이 숨 쉬는 공간
          </h2>

          <p className="mt-4 text-[14px] leading-7 text-white/80">
            작품과 공간이 만나 완성되는 특별한 경험.
            <br />
            다양한 전시장을 아티켓에서 만나보세요.
          </p>

          <Link
            to="/articket/venue"
            className="
              group mt-8 inline-flex
              w-fit items-center gap-8
              border-b border-white/80
              pb-3 text-[13px] font-medium
              text-white
              transition-colors duration-300
              hover:border-white
            "
          >
            전시장 둘러보기

            <span
              className="
                text-lg transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>

        {/* 장식용 번호 */}
        <div
          className="
            absolute bottom-7 right-8
            hidden text-[11px]
            tracking-[0.2em] text-white/75
            md:block
          "
        >
          ARTICKET · VENUE
        </div>
      </div>
    </div>
  );
};

export default MainBannerComponent;
