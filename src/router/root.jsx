import React from "react";
import { createBrowserRouter } from "react-router-dom";
import adminRouter from "./AdminRouter";
import staffRouter from "./staffRouter";
import IntroPage from "../pages/intro/IntroPage";

const roots = createBrowserRouter([
  {
    path: "/articket",
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
    ],
  },
]);

export default roots;
