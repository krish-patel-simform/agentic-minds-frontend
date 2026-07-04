import { RouterProvider, createBrowserRouter } from "react-router";
import { routeCongif } from "./routeConfig";
import { ToastProvider } from "../Component/Toast/ToastProvider";

const router = createBrowserRouter(routeCongif);

export default function RouteProvider() {
  return (
    <ToastProvider>
      <RouterProvider router={router}></RouterProvider>
    </ToastProvider>
  );
}
