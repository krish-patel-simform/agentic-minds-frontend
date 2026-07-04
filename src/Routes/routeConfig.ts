import { type RouteObject } from "react-router";
import { App } from "../App";
import CandidatePage from "../Page/CandidatePage";
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
      {
        path: "candidates",
        Component: CandidatePage,
      },
    ],
  },
];
