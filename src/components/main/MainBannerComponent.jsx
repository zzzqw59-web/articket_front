import banner from "../../asset/banner.jpg";
import { Link, useNavigate } from "react-router-dom";

const MainBannerComponent = () => {
  return (
    <div className="mt-40 select-none flex justify-center w-full">
      <div className="relative w-[1200px] h-60 overflow-hidden rounded-2xl">
        <img
          src={banner}
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 z-10 flex flex-col">
          <div
            className="head-text font-bold text-4xl text-white ml-30
            mt-20  drop-shadow-2xl"
          >
            예술이 숨 쉬는 공간
          </div>
          <Link
            to="/articket/venue"
            className="p-4 py-2 inline-flex w-auto text-white bg-[#0b2342] text-xl rounded-4xl
               head-text drop-shadow-2xl font-bold transition-all hover:translate-y-1 self-start
               ml-80 mt-3"
          >
            &nbsp;전시장 목록 &nbsp;➔
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MainBannerComponent;
