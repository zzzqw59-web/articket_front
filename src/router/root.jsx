import React from "react";
import { createBrowserRouter } from "react-router-dom";
import adminRouter from "./AdminRouter";
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
          const { default: Component } = await import("../pages/MainPage");
          return { Component };
        },
      },
      {
        path: "intro",
        element: <IntroPage />,
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
]);

export default roots;
