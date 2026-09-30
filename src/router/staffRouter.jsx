const staffRouter = () => {
  return [
    {
      index: true,
      lazy: async () => {
        const { default: Component } = await import("../pages/staff/StaffPage");
        return { Component };
      },
    },
    {
      path: "auth",
      lazy: async () => {
        const { default: Component } =
          await import("../pages/staff/StaffAuthPage");
        return { Component };
      },
    },
  ];
};

export default staffRouter;
