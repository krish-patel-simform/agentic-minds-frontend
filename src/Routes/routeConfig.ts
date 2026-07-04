import { type RouteObject } from "react-router";
import { App } from "../App";
import CandidatePage from "../Page/CandidatePage";
import JobPositionPage from "../Page/JobPositionPage";
import LoginPage from "../Page/LoginPage";
import NotFoundPage from "../Page/NotFoundPage";
import ScheduleInterviewPage from "../Page/ScheduleInterviewPage";
import ProtectedRoute from "../Component/Auth/ProtectedRoute";

export const routeCongif: RouteObject[] = [
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    Component: ProtectedRoute,
    children: [
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
            path: "schedule-interview",
            Component: ScheduleInterviewPage,
          },
          {
            path: "*",
            Component: NotFoundPage,
          },
        ],
      },
    ],
  },
];
