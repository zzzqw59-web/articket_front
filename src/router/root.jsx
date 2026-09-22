import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

const roots = createBrowserRouter([
  // 메인페이지
  {
    path: "/articket",
    HydrateFallback: () => <div>Loading...</div>,
    lazy: async () => {
      const { default: Component } = await import("../pages/MainPage");
      return { Component };
    },
  },
]);

export default roots;