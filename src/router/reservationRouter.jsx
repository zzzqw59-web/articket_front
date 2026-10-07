import React from 'react'

const reservationRouter = () => {
  return [
    {
        lazy: async () => {
        const { default: Component } = await import("../pages/reservation/ReservationPage");
        return { Component };
      },
    },
  ];
}

export default reservationRouter
