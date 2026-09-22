import "../../styles/Header.css";

const Header = () => {
  return (
    <>
      <div className="bg-[#ede6d6] h-35 flex flex-row justify-between">
        <div className="logo text-7xl select-none cursor-pointer m-4 ml-6 flex items-end">
          Articket
        </div>
        <div className="flex flex-col justify-end items-end">
          <div className="flex flex-row mr-5">
            <div
              className="head-text font-bold text-sm w-15 h-15 border-2 border-[#0b2342] rounded-full select-none cursor-pointer 
            flex items-center justify-center hover:bg-[#0b2342] hover:text-white transition-colors duration-300"
            >
              로그인
            </div>
            <div
              className="head-text font-bold text-sm w-15 h-15 border-2 border-[#5c88a8] rounded-full select-none cursor-pointer 
            flex items-center justify-center ml-2 hover:bg-[#5c88a8] hover:text-white transition-colors duration-300"
            >
              회원가입
            </div>
          </div>
          <div className="head-text flex flex-row mr-5 mb-5 mt-5 text-2xl cursor-pointer">
            <div>전시</div>
            <div>&nbsp;·&nbsp;</div>
            <div>전시장</div>
            <div>&nbsp;·&nbsp;</div>
            <div>아티켓 소개</div>
            <div>&nbsp;·&nbsp;</div>
            <div>리뷰</div>
            <div>&nbsp;·&nbsp;</div>
            <div>문의</div>
            <div>&nbsp;·&nbsp;</div>
            <div>마이 페이지</div>
            <div>&nbsp;·&nbsp;</div>
            <div>스태프 페이지</div>
            <div>&nbsp;·&nbsp;</div>
            <div>어드민 페이지</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
