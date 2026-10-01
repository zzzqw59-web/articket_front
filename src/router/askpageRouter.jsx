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
      path: ":askId/edit",
      HydrateFallback: () => <div>Loading...</div>,
      lazy: async () => {
        const { default: Component } = await import(
          "../pages/askpage/AskEditPage"
        );
        return { Component };
      },
    },
  ];
};

export default askpageRouter;