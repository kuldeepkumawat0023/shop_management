import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  Key,
  BarChart3,
  Megaphone,
  LifeBuoy,
  Users,
  Server,
  ShieldAlert,
  ListOrdered,
  Database,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils/cn";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Branches", href: "/branches", icon: Store },
  { name: "Licensing", href: "/licensing", icon: Key },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
  { name: "Help Desk", href: "/help-desk", icon: LifeBuoy },
  { name: "Admins", href: "/admins", icon: Users },
  {
    name: "System",
    isGroup: true,
    children: [
      { name: "Server Health", href: "/system/server-health", icon: Server },
      { name: "Security", href: "/system/security", icon: ShieldAlert },
      { name: "Audit Logs", href: "/system/audit-logs", icon: ListOrdered },
      { name: "Backups", href: "/system/backups", icon: Database },
    ],
  },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function SideNavBar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-300 flex flex-col border-r border-gray-800 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white tracking-wider">
          <span className="text-indigo-500">Smart</span>Shop
        </h1>
        <span className="ml-2 text-[10px] uppercase bg-gray-800 px-2 py-0.5 rounded text-gray-400">
          Super Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarLinks.map((item, index) => {
          if (item.isGroup) {
            return (
              <div key={index} className="pt-4 pb-1">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {item.name}
                </p>
                <div className="space-y-1">
                  {item.children?.map((child, cIndex) => {
                    const Icon = child.icon;
                    return (
                      <Link
                        key={cIndex}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-colors">
          <LogOut className="h-4 w-4" />
          Force Logout All
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
