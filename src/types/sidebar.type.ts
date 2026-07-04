import type { LucideIcon } from "lucide-react";

export interface SidebarSection {
  label: string;
  items: SidebarLink[];
}

export interface SidebarLink {
  name: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}
