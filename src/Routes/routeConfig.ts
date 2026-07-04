import { type RouteObject } from "react-router";
import { App } from "../App";
import CandidatePage from "../Page/CandidatePage";
import CandidateDetailPage from "../Page/CandidateDetailPage";
import JobPositionPage from "../Page/JobPositionPage";
import JobPositionDetailPage from "../Page/JobPositionDetailPage";
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
            path: "jobs/:id",
            Component: JobPositionDetailPage,
          },
          {
            path: "candidates",
            Component: CandidatePage,
          },
          {
            path: "candidates/:candidateId",
            Component: CandidateDetailPage,
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
