import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Outlet } from "react-router";

const MainPage = () => {
  return (
    <>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default MainPage;
