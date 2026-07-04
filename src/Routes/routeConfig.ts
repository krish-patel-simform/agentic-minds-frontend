import { type RouteObject } from "react-router";
import { App } from "../App";
import CandidatePage from "../Page/CandidatePage";
import JobPositionPage from "../Page/JobPositionPage";
import NotFoundPage from "../Page/NotFoundPage";
import ScheduleInterviewPage from "../Page/ScheduleInterviewPage";

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
      {
        path: "*",
        Component: NotFoundPage,
      },
      {
        path: "schedule-interview",
        Component: ScheduleInterviewPage,
      },
    ],
  },
];
