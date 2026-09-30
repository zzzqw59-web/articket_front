import React, { lazy } from "react";

const venueRouter = () => {
    return [
        {
            path: "venue",
            lazy: async () => {
                const {default: Component} = await import(
                    "../pages/venue/VenueListPage"
                );
                return {Component};
            },
        },
        {
            path: "venue/:venueId",
            lazy: async () => {
                const {default: Component} = await import(
                    "../pages/venue/VenueDetailPage"
                );
                return {Component};
            },
        },
    ];
};
export default venueRouter;