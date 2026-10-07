import React from 'react'

const paymentRouter = () => {
  return [
    {
        path: "success",
        lazy: async () => {
        const { default: Component } = await import("../pages/payment/PaymentSuccess");
        return { Component };
      },
    },
    {
        path: "fail",
        lazy: async () => {
        const { default: Component } = await import("../pages/payment/PaymentFail");
        return { Component };
      },
    },
  ];
}

export default paymentRouter
