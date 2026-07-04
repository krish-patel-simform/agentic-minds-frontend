import { Sidebar } from "../Component/Sidebar/Sidebar";
import { Outlet } from "react-router";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F9FD]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
