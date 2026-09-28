import { createBrowserRouter } from "react-router-dom";
import adminRouter from "./AdminRouter";
import staffRouter from "./staffRouter";
import IntroPage from "../pages/intro/IntroPage";
import MypageLayout from "../pages/mypage/components/MypageLayout";
import mypageRouter from "./mypageRouter";
import MainLayout from "../layouts/MainLayout";
import askpageRouter from "./askpageRouter";

const roots = createBrowserRouter([
  {
    path: "/articket",
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
      
      // 마이페이지
      {
        path: "mypage",
        element: <MypageLayout />,
        children: mypageRouter(),
      },

      // 문의페이지
      {
        path: "ask",
        children: askpageRouter(),
      },
    ],
  },
]);

export default roots;
