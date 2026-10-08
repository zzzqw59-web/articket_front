import main1 from "../../asset/main1.jpg";
import main2 from "../../asset/main2.jpg";
import main3 from "../../asset/main3.jpg";
import main4 from "../../asset/main4.jpg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MainHeadComponent = () => {
  const image = [main1, main2, main3, main4];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % image.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [image.length]);

  return (
    <div className="relative overflow-hidden w-full h-150 ">
      {image.map((imgSrc, index) => (
        <img
          key={index}
          src={imgSrc}
          className={`w-full h-150 object-cover absolute inset-0 transition-opacity duration-500
              ${index == currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}
      <div className="absolute inset-0 z-10 ml-20 drop-shadow-2xl select-none">
        <div className="bdy-text text-2xl mb-3 ml-2 mt-10 text-white tracking-[15px]">
          ARTICKET
        </div>

        <div className="head-text text-6xl font-bold text-white">
          <span className="transition-all ">
            대한민국 모든 전시의 시작과 끝
          </span>
        </div>
        <div className="head-text text-7xl font-bold text-white">
          <span className="transition-all ">예술이 있는 모든 순간, 아티켓</span>
        </div>

        <Link
          to="/articket/intro"
          className="p-4 py-2 inline-block border text-white border-white text-2xl
               head-text border-2 drop-shadow-2xl font-bold mt-60 ml-3  transition-all hover:-translate-y-2"
        >
          아티켓 소개 &nbsp;➔
        </Link>
      </div>
    </div>
  );
};
export default MainHeadComponent;
