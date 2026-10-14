import React from "react";
import MainHeadComponent from "../../components/main/MainHeadComponent";
import MainBannerComponent from "../../components/main/MainBannerComponent";
import MainPostersComponent from "../../components/main/MainPostersComponent";
import MainAskComponent from "../../components/main/MainAskComponent";
import MainReviewComponent from "../../components/main/MainReviewComponent";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <MainHeadComponent />
      <div className="w-[1100px] mx-auto">
        <div className="head-text text-5xl h-30 font-bold translate-y-10 -translate-x-10 mt-20">
          화제의 전시
        </div>
        <div className="h-[350px]">
          <MainPostersComponent />
        </div>
      </div>
      <div className="-translate-y-5">
        <MainBannerComponent />
      </div>
      <div className="w-[1200px] flex mx-auto justify-between mt-20 mb-30">
        <div>
          <div className="head-text text-5xl h-30 font-bold translate-y-15 -translate-x-5">
            <span
              onClick={() => navigate("/articket/ask")}
              className="hover:text-gray-500 cursor-pointer"
            >
              질문·문의
            </span>
          </div>
          <div className="h-[200px]">
            <MainAskComponent />
          </div>
        </div>
        <div className="mb-10">
          <div className="head-text text-5xl h-30 font-bold translate-y-15 -translate-x-5">
            <span
              onClick={() => navigate("/articket/review")}
              className="hover:text-gray-500 cursor-pointer"
            >
              관람 후기
            </span>
          </div>
          <div className="h-[200px]">
            <MainReviewComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
