import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Outlet } from "react-router";

const MainPage = () => {
  return (
    <>
      <MainLayout>
        <p>메인 페이지</p>
      </MainLayout>
    </>
  );
};

export default MainPage;
