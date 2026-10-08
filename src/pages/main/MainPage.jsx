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
      <div className="w-[1500px] mx-auto">
        <div className="head-text text-5xl h-30 font-bold translate-y-12 -translate-x-10 mt-20">
          화제의 전시
        </div>
        <MainPostersComponent />
      </div>
      <div className="-translate-y-5">
        <MainBannerComponent />
      </div>
      <div className="w-[1500px] flex mx-auto justify-between mt-20 mb-30">
        <div>
          <div className="head-text text-5xl h-30 font-bold translate-y-12 -translate-x-10">
            <span
              onClick={() => navigate("/articket/ask")}
              className="hover:text-gray-500 cursor-pointer"
            >
              질문·문의
            </span>
          </div>
          <MainAskComponent />
        </div>
        <div className="mb-10">
          <div className="head-text text-5xl h-30 font-bold translate-y-12 -translate-x-10">
            <span
              onClick={() => navigate("/articket/review")}
              className="hover:text-gray-500 cursor-pointer"
            >
              관람 후기
            </span>
          </div>
          <MainReviewComponent />
        </div>
      </div>
    </>
  );
};

export default MainPage;
