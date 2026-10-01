import React from "react";
import MainHeadComponent from "../../components/main/MainHeadComponent";
import MainBannerComponent from "../../components/main/MainBannerComponent";
import MainPostersComponent from "../../components/main/MainPostersComponent";

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
      <MainBannerComponent />
      <div className="h-96">.</div>
    </>
  );
};

export default MainPage;
