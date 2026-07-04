import DashboardPage from "./Page/DashboardPage";
import HeaderPage from "./Page/HeaderPage";

export const App = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <HeaderPage />
      <DashboardPage />
    </div>
  );
};
