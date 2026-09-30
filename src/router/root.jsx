import React from "react";
import { createBrowserRouter } from "react-router-dom";
import adminRouter from "./adminRouter";
import staffRouter from "./staffRouter";
import IntroPage from "../pages/intro/IntroPage";
import exhibitionRouter from "./exhibitionRouter";
import venueRouter from "./venueRouter";
import MainLayout from "../layouts/MainLayout";

const roots = createBrowserRouter([
  {
    path: "/articket",
    element: <MainLayout />,
    HydrateFallback: () => <div>Loading...</div>,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import("../pages/main/MainPage");
          return { Component };
        },
      },
      {
        path: "adminpage",
        children: adminRouter(),
      },
      {
        path: "staffpage",
        children: staffRouter(),
      },
      ...exhibitionRouter(),
      ...venueRouter(),
    ],
  },
  {
    path: "/articket/intro",
    element: <IntroPage />,
    HydrateFallback: () => <div>Loading...</div>,
  },
]);

export default roots;
