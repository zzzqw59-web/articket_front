import PrivateRoute from "./PrivateRoute";

const reviewRouter = () => {
  return [
    {
      index: true,
      lazy: async () => {
        const { default: Component } = await import("../pages/review/ReviewPage");
        return { Component };
      },
    },
    {
      path: ":reviewId",
      lazy: async () => {
        const { default: Component } =
          await import("../pages/review/ReviewDetailPage");
        return { Component };
      },
    },
    {
      element: <PrivateRoute />, // 👈 리뷰 작성 및 수정 페이지는 로그인 가드로 보호
      children: [
        {
          path: "write",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/review/ReviewWritePage");
            return { Component };
          },
        },
        {
          path: ":reviewId/edit",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/review/ReviewEditPage");
            return { Component };
          },
        },
      ],
    },
  ];
}

export default reviewRouter
