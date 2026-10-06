import React from 'react'

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
  ];
}

export default reviewRouter
