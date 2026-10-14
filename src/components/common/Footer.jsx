
import { Link } from "react-router-dom";
import logo from "../../asset/cat-favicon.svg";

const Footer = () => {
  return (
    <footer className="border-t border-[#DED8CE] bg-[#F3EEE4]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-5 md:px-10 lg:px-16">

        {/* 상단 영역 */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#D8D0C4] pb-7 lg:flex-row lg:gap-10">

          {/* 왼쪽: 브랜드 */}
          <div className="flex flex-col items-start">
            <Link
              to="/articket"
              className="group flex items-center gap-2"
            >
              <img
                src={logo}
                alt=""
                className="h-5 w-5 object-contain"
              />

              <span
                className="
                  logo text-[34px] leading-none
                  tracking-[-0.04em] text-[#24211D]
                  transition-opacity group-hover:opacity-70
                "
              >
                Articket
              </span>
            </Link>

            <p className="mt-3 text-[13px] leading-6 text-[#514B44]">
              예술이 일상이 되는 순간,
              <br />
              당신 곁의 Articket.
            </p>

            <p className="mt-3 text-[10px] tracking-[0.18em] text-[#938B81]">
              EXHIBITION · ART · CULTURE
            </p>
          </div>

          {/* 오른쪽: 프로젝트 정보 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">

            {/* 프로젝트 정보 */}
            <div>
              <h3 className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-[#302B26]">
                PROJECT INFORMATION
              </h3>

              <dl className="space-y-2 text-[12px] leading-5 text-[#777168]">
                <div className="flex gap-3">
                  <dt className="w-[42px] shrink-0 text-[#514B44]">
                    대표자
                  </dt>
                  <dd>김성민</dd>
                </div>

                <div className="flex gap-3">
                  <dt className="w-[42px] shrink-0 text-[#514B44]">
                    제작자
                  </dt>
                  <dd className="max-w-[250px]">
                    김성민, 김태현, 육현승, 최서현, 한진형
                  </dd>
                </div>

                <div className="flex gap-3">
                  <dt className="w-[42px] shrink-0 text-[#514B44]">
                    운영
                  </dt>
                  <dd>월~금 09:00~18:00</dd>
                </div>
              </dl>
            </div>

            {/* 연락처 정보 */}
            <div>
              <h3 className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-[#302B26]">
                CONTACT & LOCATION
              </h3>

              <dl className="space-y-2 text-[12px] leading-5 text-[#777168]">
                <div className="flex gap-3">
                  <dt className="w-[42px] shrink-0 text-[#514B44]">
                    이메일
                  </dt>
                  <dd className="break-all">
                    Articket@gmail.com
                  </dd>
                </div>

                <div className="flex gap-3">
                  <dt className="w-[42px] shrink-0 text-[#514B44]">
                    연락처
                  </dt>
                  <dd>010-1234-1234</dd>
                </div>

                <div className="flex gap-3">
                  <dt className="w-[42px] shrink-0 text-[#514B44]">
                    주소
                  </dt>
                  <dd className="max-w-[260px]">
                    서울특별시 종로구 우정국로 2
                    <br />
                    3층 301호
                  </dd>
                </div>
              </dl>
            </div>

          </div>
        </div>

        {/* 하단 영역 */}
        <div className="flex flex-col justify-between gap-2 pt-4 text-[11px] text-[#938B81] sm:flex-row sm:items-center">
          <span>
            © 2026 Articket. All rights reserved.
          </span>

          <span>
            Articket Team Project · 2026
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
