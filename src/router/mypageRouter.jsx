import { Navigate } from "react-router-dom";

const mypageRouter = () => {
  return [
    {
      // /articket/mypage 접속 시 기본 페이지로 '예약 내역' 리다이렉트
      index: true,
      element: <Navigate to="reservations" replace />,
    },
    {
      // /articket/mypage/edit (회원 정보 수정)
      path: "edit",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/mypage/MemberEditPage"
        );
        return { Component };
      },
    },
    {
      // /articket/mypage/reservations (예약 내역)
      path: "reservations",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/mypage/ReservationListPage"
        );
        return { Component };
      },
    },
    {
      // /articket/mypage/payments (결제 내역)
      path: "payments",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/mypage/PaymentListPage.jsx"
        );
        return { Component };
      },
    },
    {
      // /articket/mypage/wishlist (위시리스트)
      path: "wishlist",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/mypage/WishlistPage"
        );
        return { Component };
      },
    },
    {
      // /articket/mypage/my-posts (내 게시물: 리뷰/문의/댓글)
      path: "my-posts",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/mypage/MyPostPage"
        );
        return { Component };
      },
    },
    {
      // /articket/mypage/history (관람 내역: 다녀온 전시)
      path: "history",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/mypage/VisitedHistoryPage"
        );
        return { Component };
      },
    },
  ];
};

export default mypageRouter;