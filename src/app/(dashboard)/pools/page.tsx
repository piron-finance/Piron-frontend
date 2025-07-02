"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Target,
  Calendar,
  ArrowUpRight,
  Timer,
  CheckCircle,
  Award,
  AlertCircle,
  Percent,
  Building2,
} from "lucide-react";

const poolsData = [
  {
    id: "1",
    name: "Nigerian Treasury Bills",
    issuer: "Central Bank of Nigeria",
    expectedAPY: 24.2,
    targetRaise: 5000000,
    totalRaised: 4250000,
    maturityDate: "2025-09-15",
    timeRemaining: "6 days",
    minimumInvestment: 1000,
    participants: 1247,
    status: "FUNDING",
    category: "Government",
    description:
      "Short-term government securities backed by the full faith and credit of Nigeria",
  },
  {
    id: "2",
    name: "MTN Group Corporate Bond",
    issuer: "MTN Group Limited",
    expectedAPY: 16.8,
    targetRaise: 15000000,
    totalRaised: 15000000,
    maturityDate: "2026-12-31",
    timeRemaining: "Active",
    minimumInvestment: 5000,
    participants: 892,
    status: "INVESTED",
    category: "Corporate",
    description:
      "24-month fixed-rate corporate bond from Africa's leading telecommunications company",
  },
  {
    id: "3",
    name: "Dangote Commercial Paper",
    issuer: "Dangote Industries Limited",
    expectedAPY: 21.5,
    targetRaise: 8500000,
    totalRaised: 2100000,
    maturityDate: "2025-06-30",
    timeRemaining: "12 days",
    minimumInvestment: 2500,
    participants: 634,
    status: "FUNDING",
    category: "Commercial",
    description:
      "180-day commercial paper from Nigeria's largest industrial conglomerate",
  },
  {
    id: "4",
    name: "Access Bank Fixed Deposit",
    issuer: "Access Bank PLC",
    expectedAPY: 14.5,
    targetRaise: 3000000,
    totalRaised: 3000000,
    maturityDate: "2025-12-15",
    timeRemaining: "Completed",
    minimumInvestment: 1500,
    participants: 456,
    status: "MATURED",
    category: "Banking",
    description: "12-month fixed deposit certificate with guaranteed returns",
  },
  {
    id: "5",
    name: "Lafarge Cement Bond",
    issuer: "Lafarge Africa PLC",
    expectedAPY: 18.2,
    targetRaise: 12000000,
    totalRaised: 850000,
    maturityDate: "2027-08-31",
    timeRemaining: "28 days",
    minimumInvestment: 10000,
    participants: 89,
    status: "FUNDING",
    category: "Infrastructure",
    description:
      "36-month infrastructure bond supporting cement production expansion",
  },
  {
    id: "6",
    name: "Zenith Bank Commercial Paper",
    issuer: "Zenith Bank PLC",
    expectedAPY: 19.8,
    targetRaise: 6000000,
    totalRaised: 1200000,
    maturityDate: "2025-05-15",
    timeRemaining: "4 days",
    minimumInvestment: 5000,
    participants: 234,
    status: "FUNDING",
    category: "Banking",
    description:
      "90-day short-term commercial paper from top-tier Nigerian bank",
  },
];

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "FUNDING":
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    case "INVESTED":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "MATURED":
      return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "FUNDING":
      return Timer;
    case "INVESTED":
      return CheckCircle;
    case "MATURED":
      return Award;
    default:
      return Clock;
  }
};

export default function PoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const categories = [
    "All",
    "Government",
    "Corporate",
    "Commercial",
    "Banking",
    "Infrastructure",
  ];
  const statuses = ["All", "FUNDING", "INVESTED", "MATURED"];

  const filteredPools = poolsData
    .filter((pool) => {
      const matchesSearch =
        pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || pool.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "All" || pool.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => b.expectedAPY - a.expectedAPY);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Investment Pools
            </h1>
            <p className="text-lg text-slate-400">
              Discover high-yield tokenized securities from trusted issuers
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {poolsData.length}
              </div>
              <div className="text-sm text-slate-400">Total Pools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {
                  poolsData.filter(
                    (p) => p.status === "FUNDING" || p.status === "INVESTED"
                  ).length
                }
              </div>
              <div className="text-sm text-slate-400">Active</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by pool name or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-500/50 focus:outline-none text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none text-lg min-w-[150px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none text-lg min-w-[150px]"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {filteredPools.map((pool) => {
          const StatusIcon = getStatusIcon(pool.status);

          return (
            <div key={pool.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8 hover:border-slate-600/60 hover:bg-slate-800/70 transition-all duration-500 group-hover:transform group-hover:scale-[1.01] shadow-xl shadow-black/10">
                {/* Pool Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-slate-50 transition-colors">
                        {pool.name}
                      </h3>
                      <p className="text-slate-400 text-lg font-medium">
                        {pool.issuer}
                      </p>
                    </div>
                    <div className="text-right bg-gradient-to-br from-slate-700/30 to-slate-600/30 rounded-2xl p-4 border border-slate-600/20">
                      <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-300/90 to-pink-300/90 bg-clip-text">
                        {pool.expectedAPY}%
                      </div>
                      <div className="text-sm text-slate-400 font-medium">
                        APY
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-600/20">
                    <p className="text-slate-300 leading-relaxed">
                      {pool.description}
                    </p>
                  </div>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-900/30 rounded-xl p-3 border border-slate-600/20">
                      <span className="text-slate-400 flex items-center space-x-2 font-medium">
                        <DollarSign className="w-4 h-4 text-emerald-400/80" />
                        <span>Min Investment</span>
                      </span>
                      <span className="text-slate-200 font-bold text-lg">
                        {formatCurrency(pool.minimumInvestment)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/30 rounded-xl p-3 border border-slate-600/20">
                      <span className="text-slate-400 flex items-center space-x-2 font-medium">
                        <Users className="w-4 h-4 text-sky-400/80" />
                        <span>Investors</span>
                      </span>
                      <span className="text-slate-200 font-bold text-lg">
                        {pool.participants.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-900/30 rounded-xl p-3 border border-slate-600/20">
                      <span className="text-slate-400 flex items-center space-x-2 font-medium">
                        <Calendar className="w-4 h-4 text-violet-400/80" />
                        <span>Maturity</span>
                      </span>
                      <span className="text-slate-200 font-bold text-lg">
                        {new Date(pool.maturityDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/30 rounded-xl p-3 border border-slate-600/20">
                      <span className="text-slate-400 flex items-center space-x-2 font-medium">
                        <Building2 className="w-4 h-4 text-amber-400/80" />
                        <span>Type</span>
                      </span>
                      <span className="text-slate-200 font-bold text-lg">
                        {pool.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pool Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(pool.status)}`}
                    >
                      {pool.status}
                    </span>
                    <div className="flex items-center space-x-2 text-slate-400 bg-slate-900/30 rounded-lg px-3 py-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {pool.timeRemaining}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/pools/${pool.id}`}
                    className="group/btn flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-500/90 hover:to-pink-500/90 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/15"
                  >
                    <span>
                      {pool.status === "FUNDING"
                        ? "Invest Now"
                        : pool.status === "INVESTED"
                          ? "View Pool"
                          : pool.status === "MATURED"
                            ? "Claim Returns"
                            : "View Details"}
                    </span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPools.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            No pools found
          </h3>
          <p className="text-slate-400 text-lg">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
