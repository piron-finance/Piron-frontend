"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Target,
  BarChart3,
  Users,
  Settings,
  Plus,
  FileText,
  TrendingUp,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Home,
} from "lucide-react";

const adminSidebarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "Create Pool",
    href: "/admin/pools/create",
    icon: Plus,
  },
  {
    name: "Manage Pools",
    href: "/admin/pools",
    icon: Target,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: FileText,
  },
];

const bottomItems = [
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    name: "Back to App",
    href: "/dashboard/pools",
    icon: Home,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 z-50">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center space-x-3 p-6 border-b border-white/5">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Admin Panel
                </span>
                <div className="text-xs text-slate-400">Piron Finance</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {adminSidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Bottom Navigation */}
            <div className="p-4 border-t border-white/5">
              <div className="space-y-2">
                {bottomItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Admin User Section */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      Admin User
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      admin@piron.finance
                    </p>
                  </div>
                </div>
                <button className="flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors w-full mt-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Top Bar */}
          <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between px-6 h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">
                  {pathname === "/admin" && "Admin Dashboard"}
                  {pathname === "/admin/pools/create" && "Create New Pool"}
                  {pathname === "/admin/pools" && "Manage Pools"}
                  {pathname === "/admin/analytics" && "Analytics"}
                  {pathname === "/admin/users" && "User Management"}
                  {pathname === "/admin/transactions" && "Transactions"}
                  {pathname === "/admin/settings" && "Settings"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Admin Mode</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="relative z-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
