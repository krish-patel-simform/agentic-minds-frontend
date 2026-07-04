import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  UserSearch,
  Video,
  Headset,
} from "lucide-react";
import { NavLink } from "react-router";
import type { SidebarSection } from "../../types/sidebar.type";

export const Sidebar = () => {
  const sections: SidebarSection[] = [
    {
      label: "MAIN",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        { name: "Candidates", icon: Users, path: "/candidates", badge: 3 },
        { name: "Screening Reports", icon: FileText, path: "/reports" },
        { name: "Interview Pipeline", icon: Video, path: "/pipeline" },
        {
          name: "Schedule Interview",
          icon: Headset,
          path: "/schedule-interview",
        },
      ],
    },
    {
      label: "MANAGE",
      items: [
        { name: "Job Positions", icon: Briefcase, path: "/jobs" },
        { name: "Recruiters", icon: UserSearch, path: "/recruiters" },
        { name: "Settings", icon: Settings, path: "/settings" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-1 py-6">
        {sections.map((section) => (
          <div key={section.label} className="mb-6">
            <h3 className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {section.label}
            </h3>
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-700"
                      : "text-gray-500 hover:bg-gray-50"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-100">
        <p className="text-sm font-bold text-slate-800">Admin User</p>
        <p className="text-xs text-gray-400">admin@simrecruiter.ai</p>
      </div>
    </aside>
  );
};
