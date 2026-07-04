import { RouterProvider, createBrowserRouter } from "react-router";
import { routeCongif } from "./routeConfig";

const router = createBrowserRouter(routeCongif);

export default function RouteProvider() {
  return <RouterProvider router={router}></RouterProvider>;
}
