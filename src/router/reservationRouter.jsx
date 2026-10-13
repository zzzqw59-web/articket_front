import React from 'react'

const reservationRouter = () => {
  return [
    {
        index: true,
        lazy: async () => {
        const { default: Component } = await import("../pages/reservation/ReservationPage");
        return { Component };
      },
    },
  ];
}

export default reservationRouter
