import PrivateRoute from "./PrivateRoute";

const askpageRouter = () => {
  return [
    {
      // /articket/ask (문의 목록 페이지)
      index: true,
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/askpage/AskListPage"
        );
        return { Component };
      },
    },
    {
      path: ":askId",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/askpage/AskDetailPage"
        );
        return { Component };
      },
    },
    {
      element: <PrivateRoute />, // 👈 문의 작성 및 수정 페이지는 로그인 가드로 보호
      children: [
        {
          path: "write",
          HydrateFallback: () => <div>Loading...</div>,
          lazy: async () => {
            const { default: Component } = await import(
              "../pages/askpage/AskWritePage"
            );
            return { Component };
          },
        },
        {
          path: ":askId/edit",
          HydrateFallback: () => <div>Loading...</div>,
          lazy: async () => {
            const { default: Component } = await import(
              "../pages/askpage/AskEditPage"
            );
            return { Component };
          },
        },
      ],
    },
  ];
};

export default askpageRouter;