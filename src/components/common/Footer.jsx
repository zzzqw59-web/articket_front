import logo from "../../asset/cat-favicon.svg";

const Footer = () => {
  return (
    <div className="bg-[#ede6d6] h-50 flex flex-row justify-between">
      <div className="flex flex-col mt-2 select-none ">
        <div className="flex flex-row">
          <img src={logo} alt="고양이 아이콘" className="w-5 h-5 mt-8 ml-9" />
          <div className="logo text-5xl mt-4 ml-2 flex">Articket</div>
        </div>
        <div className="head-text text-sm ml-14">
          © 2026 Articket. All rights reserved.
        </div>
      </div>
      <div className="head-text flex flex-col font text-xs mr-9 mt-13">
        <div>대표자 &ensp;&emsp;김성민</div>
        <div>제작자 &ensp;&emsp;김성민, 김태현, 육현승, 최서현, 한진형</div>
        <br />
        <div>운영 시간 &ensp; 월~금 09:00~18:00</div>
        <div>연락처 &emsp;&emsp;Articket@gmail.com | 010-1234-1234</div>
        <br />
        <div>사업자 번호 &nbsp;000-00-00000</div>
        <div>
          주소 &emsp;&emsp;&emsp;서울특별시 종로구 우정국로 2 3층 301호(관철동,
          교원광교빌딩)
        </div>
      </div>
    </div>
  );
};
export default Footer;
