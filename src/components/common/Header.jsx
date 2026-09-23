import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleScrollClick = (e) => {
    if (e.target.closest("a")) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      onClick={handleScrollClick}
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-600
        ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="bg-[#ede6d6] h-35 flex flex-row justify-between">
        <Link to="/articket">
          <div
            className="logo text-7xl select-none cursor-pointer mt-13 m-4 ml-6 flex items-end transition-colors duration-100
          hover:text-[#ede6d6] hover:[--text-stroke-width:1px] hover:[--text-stroke-color:#000000] 
          hover:[-webkit-text-stroke-width:1px] hover:[-webkit-text-stroke-color:#000000]"
          >
            Articket
          </div>
        </Link>
        <div className="flex flex-col justify-end items-end">
          <div className="flex flex-row mr-5">
            <Link to="/articket/login">
              <div
                className="head-text font-bold text-sm w-15 h-15 border-2 border-[#0b2342] rounded-full select-none cursor-pointer 
            flex items-center justify-center hover:bg-[#0b2342] hover:text-white transition-colors duration-300"
              >
                로그인
              </div>
            </Link>
            <Link to="/articket/signup">
              <div
                className="head-text font-bold text-sm w-15 h-15 border-2 border-[#5c88a8] rounded-full select-none cursor-pointer 
            flex items-center justify-center ml-2 hover:bg-[#5c88a8] hover:text-white transition-colors duration-300"
              >
                회원가입
              </div>
            </Link>
          </div>
          <div className="head-text flex flex-row mr-5 mb-5 mt-3 text-2xl cursor-pointer">
            <Link to="/articket/exhibition">
              <div>전시</div>
            </Link>

            <div>&nbsp;·&nbsp;</div>
            <Link to="/articket/venue">
              <div>전시장</div>
            </Link>

            <div>&nbsp;·&nbsp;</div>
            <Link to="/articket/intro">
              <div>아티켓 소개</div>
            </Link>

            <div>&nbsp;·&nbsp;</div>
            <Link to="/articket/review">
              <div>리뷰</div>
            </Link>

            <div>&nbsp;·&nbsp;</div>
            <Link to="/articket/ask">
              <div>문의</div>
            </Link>

            <div>&nbsp;·&nbsp;</div>
            <Link to="/articket/wishlist">
              <div>마이 페이지</div>
            </Link>

            <div>&nbsp;·&nbsp;</div>
            <Link to="/articket/staffpage">
              <div>스태프 페이지</div>
            </Link>

            <div>&nbsp;·&nbsp;</div>
            <Link to="/articket/adminpage">
              <div>어드민 페이지</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
