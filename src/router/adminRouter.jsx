const adminRouter = () => {
  return [
    {
      index: true,
      lazy: async () => {
        const { default: Component } = await import("../pages/admin/AdminPage");
        return { Component };
      },
    },
    {
      path: "manage",
      lazy: async () => {
        const { default: Component } =
          await import("../pages/admin/AdminManagePage");
        return { Component };
      },
    },
  ];
};

export default adminRouter;
