import main1 from "../../asset/main1.jpg";
import main2 from "../../asset/main2.jpg";
import main3 from "../../asset/main3.jpg";
import main4 from "../../asset/main4.jpg";
import banner from "../../asset/banner.png";
import "./Main.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MainComponent = () => {
  const image = [main1, main2, main3, main4];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % image.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [image.length]);

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
      </div>
      <div>
        <div className="head-text text-5xl h-30 mt-30 ml-30 font-bold">
          전시
        </div>
        <div className="h-[800px]">.</div>
      </div>
      <div className="flex justify-center w-[1700px] mx-auto mb-30">
        <Link to="/articket/venue">
          <img src={banner} className="self-center cursor-pointer" />
        </Link>
      </div>
    </>
  );
};

export default MainComponent;
