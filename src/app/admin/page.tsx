"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  RefreshCw,
  Activity,
  Shield,
  Database,
  Server,
  Zap,
} from "lucide-react";

// Mock data for admin dashboard
const dashboardStats = {
  totalValueLocked: 29450000,
  totalPools: 5,
  totalInvestors: 3338,
  averageAPY: 19.8,
  activeFunding: 1,
  pendingInvestments: 1,
  maturedPools: 1,
  emergencyPools: 1,
  monthlyGrowth: {
    tvl: 12.5,
    investors: 23.7,
    pools: 25.0,
  },
};

const recentActivity = [
  {
    id: "1",
    type: "POOL_CREATED",
    title: "New pool created",
    description: "Nigerian Treasury Bills Q3 2025",
    timestamp: "2025-03-01T10:00:00",
    status: "success",
  },
  {
    id: "2",
    type: "INVESTMENT_PROCESSED",
    title: "Investment processed",
    description: "Zenith Bank Commercial Paper - $4.0M",
    timestamp: "2025-02-28T14:30:00",
    status: "success",
  },
  {
    id: "3",
    type: "POOL_MATURED",
    title: "Pool matured",
    description: "Dangote Commercial Paper 2025-A",
    timestamp: "2025-01-30T09:15:00",
    status: "info",
  },
  {
    id: "4",
    type: "EMERGENCY_EXIT",
    title: "Emergency exit triggered",
    description: "Access Bank Fixed Deposit Premium",
    timestamp: "2024-10-31T16:45:00",
    status: "warning",
  },
  {
    id: "5",
    type: "USER_REGISTERED",
    title: "New user registered",
    description: "234 new users this week",
    timestamp: "2025-02-25T11:20:00",
    status: "info",
  },
];

const systemStatus = [
  {
    name: "Blockchain Network",
    status: "operational",
    latency: "12ms",
    uptime: "99.9%",
  },
  {
    name: "Smart Contracts",
    status: "operational",
    latency: "45ms",
    uptime: "100%",
  },
  {
    name: "Database",
    status: "operational",
    latency: "8ms",
    uptime: "99.8%",
  },
  {
    name: "API Gateway",
    status: "operational",
    latency: "23ms",
    uptime: "99.9%",
  },
];

const topPools = [
  {
    id: "2",
    name: "MTN Group Corporate Bond",
    tvl: 10000000,
    investors: 1234,
    apy: 16.8,
    status: "INVESTED",
  },
  {
    id: "3",
    name: "Dangote Commercial Paper",
    tvl: 7500000,
    investors: 567,
    apy: 21.5,
    status: "MATURED",
  },
  {
    id: "5",
    name: "Zenith Bank Commercial Paper",
    tvl: 4000000,
    investors: 456,
    apy: 19.8,
    status: "PENDING_INVESTMENT",
  },
];

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "POOL_CREATED":
      return Plus;
    case "INVESTMENT_PROCESSED":
      return DollarSign;
    case "POOL_MATURED":
      return Target;
    case "EMERGENCY_EXIT":
      return AlertCircle;
    case "USER_REGISTERED":
      return Users;
    default:
      return Activity;
  }
};

const getActivityColor = (status: string) => {
  switch (status) {
    case "success":
      return "text-green-400";
    case "warning":
      return "text-yellow-400";
    case "error":
      return "text-red-400";
    default:
      return "text-blue-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "FUNDING":
      return "bg-blue-500/20 text-blue-300";
    case "PENDING_INVESTMENT":
      return "bg-yellow-500/20 text-yellow-300";
    case "INVESTED":
      return "bg-green-500/20 text-green-300";
    case "MATURED":
      return "bg-purple-500/20 text-purple-300";
    case "EMERGENCY":
      return "bg-red-500/20 text-red-300";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-400">
            Monitor platform performance and manage operations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/pools/create"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600/90 to-orange-600/90 hover:from-red-500/90 hover:to-orange-500/90 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/15"
          >
            <Plus className="w-5 h-5" />
            <span>Create Pool</span>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400/80" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                +{dashboardStats.monthlyGrowth.tvl}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(dashboardStats.totalValueLocked)}
          </div>
          <div className="text-sm text-slate-400">Total Value Locked</div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400/80" />
            </div>
            <div className="flex items-center space-x-1 text-blue-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                +{dashboardStats.monthlyGrowth.pools}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardStats.totalPools}
          </div>
          <div className="text-sm text-slate-400">Total Pools</div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400/80" />
            </div>
            <div className="flex items-center space-x-1 text-purple-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                +{dashboardStats.monthlyGrowth.investors}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardStats.totalInvestors.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Total Investors</div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400/80" />
            </div>
            <div className="text-slate-400 text-sm">Average</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardStats.averageAPY}%
          </div>
          <div className="text-sm text-slate-400">Average APY</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Pool Status Overview */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Pool Status Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Active Funding
                      </div>
                      <div className="text-sm text-slate-400">
                        Pools accepting investments
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {dashboardStats.activeFunding}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Pending Investment
                      </div>
                      <div className="text-sm text-slate-400">
                        Awaiting investment processing
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {dashboardStats.pendingInvestments}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Matured Pools
                      </div>
                      <div className="text-sm text-slate-400">
                        Completed investments
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {dashboardStats.maturedPools}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Emergency Status
                      </div>
                      <div className="text-sm text-slate-400">
                        Pools requiring attention
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-400">
                    {dashboardStats.emergencyPools}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href="/admin/pools"
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors"
              >
                <span>View All Pools</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              System Status
            </h2>
            <div className="space-y-4">
              {systemStatus.map((system, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-600/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <div className="font-medium text-slate-200">
                        {system.name}
                      </div>
                      <div className="text-sm text-slate-400">
                        {system.latency} • {system.uptime}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-green-400 font-medium">
                    {system.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Performing Pools */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Top Performing Pools
          </h2>
          <div className="space-y-4">
            {topPools.map((pool, index) => (
              <div
                key={pool.id}
                className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-slate-400">
                    #{index + 1}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-400/80" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">
                      {pool.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {pool.investors} investors
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-200">
                    {formatCurrency(pool.tvl)}
                  </div>
                  <div className="text-sm text-orange-400">{pool.apy}% APY</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.status);

              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-slate-900/30 rounded-xl border border-slate-600/20"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800/50`}
                  >
                    <ActivityIcon className={`w-5 h-5 ${colorClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-200">
                      {activity.title}
                    </div>
                    <div className="text-sm text-slate-400 truncate">
                      {activity.description}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()} at{" "}
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
