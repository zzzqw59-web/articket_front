import { createBrowserRouter } from "react-router-dom";
import adminRouter from "./AdminRouter";
import staffRouter from "./staffRouter";
import IntroPage from "../pages/intro/IntroPage";
import MypageLayout from "../pages/mypage/components/MypageLayout";
import mypageRouter from "./mypageRouter";

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

      // 마이페이지
      {
        path: "mypage",
        element: <MypageLayout />,
        children: mypageRouter(),
      },
    ],
  },
]);

export default roots;
