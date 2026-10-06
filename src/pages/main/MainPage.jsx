import React from "react";
import MainHeadComponent from "../../components/main/MainHeadComponent";
import MainBannerComponent from "../../components/main/MainBannerComponent";
import MainPostersComponent from "../../components/main/MainPostersComponent";
import MainAskComponent from "../../components/main/MainAskComponent";

const MainPage = () => {
  return (
    <>
      <MainHeadComponent />
      <div className="w-[1500px]">
        <div className="head-text text-5xl h-30 mt-30 ml-40 font-bold translate-y-12">
          화제의 전시
        </div>
        <MainPostersComponent />
      </div>
      <div className="-translate-y-5">
        <MainBannerComponent />
      </div>
      <div className="w-[1500px] flex mx-auto justify-between mt-20">
        <div>
          <div className="head-text text-5xl h-30 font-bold translate-y-12 -translate-x-10">
            질문·문의
          </div>
          <MainAskComponent />
        </div>
        <div className="mb-30">
          <div className="head-text text-5xl h-30 font-bold translate-y-12 -translate-x-10">
            관람 후기
          </div>
          <MainAskComponent />
        </div>
      </div>
    </>
  );
};

export default MainPage;
