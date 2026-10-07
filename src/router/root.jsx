import { createBrowserRouter } from "react-router-dom";
import adminRouter from "./adminRouter";
import staffRouter from "./staffRouter";
import IntroPage from "../pages/intro/IntroPage";
import MypageLayout from "../pages/mypage/components/MypageLayout";
import mypageRouter from "./mypageRouter";
import askpageRouter from "./askpageRouter";
import exhibitionRouter from "./exhibitionRouter";
import venueRouter from "./venueRouter";
import MainLayout from "../layouts/MainLayout";
import reviewRouter from "./reviewRouter";
import reservationRouter from "./reservationRouter";
import paymentRouter from "./paymentRouter";
import authRouter from "./authRouter";

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
        path: "intro",
        element: <IntroPage />,
      },

      // 로그인 / 회원가입 / 비밀번호 찾기
      ...authRouter(),

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

      ...exhibitionRouter(),
      ...venueRouter(),

      {
        path: "review",
        children: reviewRouter(),
      },
      {
        path: "reservation",
        children: reservationRouter(),
      },
      {
        path: "payment",
        children: paymentRouter(),
      },
    ],
  },
]);

export default roots;