import main1 from "../../asset/main1.jpg";
import main2 from "../../asset/main2.jpg";
import main3 from "../../asset/main3.jpg";
import main4 from "../../asset/main4.jpg";
import banner from "../../asset/banner.jpg";
import "./Main.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getExhibitionList } from "../../api/exhibitionApi";

const MainComponent = () => {
  const image = [main1, main2, main3, main4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posters, setPosters] = useState([]);
  const navigate = useNavigate();

  const fetchPosters = async () => {
    try {
      const posters = await getExhibitionList({ page: 5 });
      setPosters(posters.content.slice(0, 4));
    } catch (e) {
      console.error("fail to get exhibition list");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % image.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [image.length]);

  useEffect(() => {
    fetchPosters();
  }, []);

  return (
    <>
      <div className="relative overflow-hidden w-full h-150">
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
            <span className="transition-all ">
              예술이 있는 모든 순간, 아티켓
            </span>
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

      <div className="w-[1500px]">
        <div className="head-text text-5xl h-30 mt-30 ml-40 font-bold translate-y-12">
          화제의 전시
        </div>
        <div className="flex justify-center w-full ml-50">
          <div className="grid grid-cols-4 gap-9 w-full">
            {posters.map((poster, index) => (
              <div
                key={poster.id || index}
                className="group relative overflow-hidden cursor-pointer"
                onClick={() => navigate(`/articket/exhibition/${poster.id}`)}
              >
                <div className="w-full h-[500px]">
                  <img
                    src={poster.imgUrl}
                    alt={poster.title}
                    className="w-full h-full object-fill"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-40 select-none flex justify-center w-full">
        <div className="relative w-[1600px] h-70 overflow-hidden rounded-2xl">
          <img
            src={banner}
            className="object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 z-10 flex flex-col">
            <div
              className="head-text font-bold text-5xl text-white ml-15
            mt-20  drop-shadow-2xl"
            >
              예술이 숨 쉬는 공간
            </div>
            <Link
              to="/articket/venue"
              className="p-4 py-2 inline-flex w-auto text-white bg-[#0b2342] text-2xl rounded-4xl
               head-text drop-shadow-2xl font-bold transition-all hover:translate-y-1 self-start
               ml-75 mt-3"
            >
              &nbsp;전시장 목록 &nbsp;➔
            </Link>
          </div>
        </div>
      </div>

      <div className="h-96">/</div>
    </>
  );
};

export default MainComponent;
