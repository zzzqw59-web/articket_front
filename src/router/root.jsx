import { createBrowserRouter, Navigate } from "react-router-dom";
import RoleGuard from "./RoleGuard";
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
import qrCodeRouter from "./qrCodeRouter";

const roots = createBrowserRouter([
  // 루트 주소 접속 시 메인페이지로 이동
  {
    path: "/",
    element: <Navigate to="/articket" replace />,
  },

  {
    path: "/articket",
    element: <MainLayout />,
    HydrateFallback: () => <div>Loading...</div>,
    children: [
      // 메인페이지
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import(
            "../pages/main/MainPage"
          );

          return { Component };
        },
      },

      // 로그인 / 회원가입 / 비밀번호 찾기
      ...authRouter(),

      // 관리자
      {
        path: "adminpage",
        element: <RoleGuard allowedRole="ADMIN" />,
        children: adminRouter(),
      },

      // 스태프
      {
        path: "staffpage",
        element: <RoleGuard allowedRole="STAFF" />,
        children: staffRouter(),
      },

      // 마이페이지
      {
        path: "mypage",
        element: <MypageLayout />,
        children: mypageRouter(),
      },

      // 문의
      {
        path: "ask",
        children: askpageRouter(),
      },

      // 전시 / 전시장
      ...exhibitionRouter(),
      ...venueRouter(),

      // 리뷰
      {
        path: "review",
        children: reviewRouter(),
      },

      // 예약
      {
        path: "exhibition/:exhibitionId/reservation",
        children: reservationRouter(),
      },

      // 결제
      {
        path: "payment",
        children: paymentRouter(),
      },

      // QR 예약 확인
      {
        path: "reservation/check/:orderId",
        children: qrCodeRouter(),
      },
    ],
  },

  // 아티켓 소개
  {
    path: "/articket/intro",
    element: <IntroPage />,
    HydrateFallback: () => <div>Loading...</div>,
  },
]);

export default roots;
