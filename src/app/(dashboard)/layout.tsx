"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  PieChart,
  BarChart3,
  Wallet,
  Settings,
  User,
  LogOut,
  Building2,
  FileText,
  TrendingUp,
} from "lucide-react";
import { ConnectButton } from "@/components/connect-button";

const sidebarItems = [
  {
    name: "Overview",
    href: "/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Pools",
    href: "/pools",
    icon: Target,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: PieChart,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: TrendingUp,
  },
];

const bottomItems = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 z-50">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center space-x-3 p-6 border-b border-white/5">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-white">
                Piron Finance
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
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
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Section */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      User
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      user@example.com
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
                  {pathname === "/dashboard/pools" && "Investment Pools"}
                  {pathname.startsWith("/dashboard/pools/") && "Pool Details"}
                  {pathname === "/dashboard/portfolio" && "Portfolio"}
                  {pathname === "/dashboard/analytics" && "Analytics"}
                  {pathname === "/dashboard/transactions" && "Transactions"}
                  {pathname === "/dashboard/settings" && "Settings"}
                  {pathname === "/dashboard/profile" && "Profile"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <ConnectButton />
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
