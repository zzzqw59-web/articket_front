import React from 'react'

const qrCodeRouter = () => {
  return [
    {
        index: true,
        lazy: async () => {
            const { default: Component } = await import(
                "../pages/reservation/ReservationCheckPage"
            );
            return { Component };
        },
    }
  ]
}

export default qrCodeRouter
