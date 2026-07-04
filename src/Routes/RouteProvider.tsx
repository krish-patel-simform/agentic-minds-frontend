import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router";
import { routeCongif } from "./routeConfig";
import { ToastProvider } from "../Component/Toast/ToastProvider";
import { store } from "../store/store";

const router = createBrowserRouter(routeCongif);

export default function RouteProvider() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router}></RouterProvider>
      </ToastProvider>
    </Provider>
  );
}
