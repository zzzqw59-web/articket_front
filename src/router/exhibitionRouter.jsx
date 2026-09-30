import React, { lazy } from "react";

const exhibitionRouter = () => {
    return [
        {
            path: "exhibition",
            lazy: async () => {
                const {default: Component} = await import(
                    "../pages/exhibition/ExhibitionListPage"
                );
                return {Component};
            },
        },
        {
            path: "exhibition/:exhibitionId",
            lazy: async () => {
                const {default: Component} = await import(
                    "../pages/exhibition/ExhibitionDetailPage"
                );
                return {Component};
            },
        },
        {
            path: "exhibition/:exhibitionId/edit",
            lazy: async () => {
                const {default: Component} = await import(
                    "../pages/exhibition/ExhibitionEditPage"
                );
                return {Component};
            },
        },
    ];
};
export default exhibitionRouter;