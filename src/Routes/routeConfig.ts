import { type RouteObject } from "react-router";
import { App } from "../App";
import JobPositionPage from "../Page/JobPositionPage";

export const routeCongif: RouteObject[] = [
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "jobs",
        Component: JobPositionPage,
      },
    ],
  },
];
