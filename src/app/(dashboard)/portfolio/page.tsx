"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Clock,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Building2,
  Percent,
  Users,
  AlertCircle,
  CheckCircle,
  Timer,
} from "lucide-react";

// Mock portfolio data
const portfolioData = {
  totalValue: 125750,
  totalInvested: 98500,
  totalReturns: 27250,
  returnsPercentage: 27.66,
  activeInvestments: 5,
  maturedInvestments: 3,
  pendingReturns: 8420,
};

const holdings = [
  {
    id: "1",
    poolName: "Nigerian Treasury Bills",
    issuer: "Central Bank of Nigeria",
    investedAmount: 25000,
    currentValue: 31200,
    returns: 6200,
    returnsPercentage: 24.8,
    apy: 24.2,
    status: "INVESTED",
    maturityDate: "2025-09-15",
    investmentDate: "2025-03-01",
    category: "Government",
    riskLevel: "Very Low",
  },
  {
    id: "2",
    poolName: "MTN Group Corporate Bond",
    issuer: "MTN Group Limited",
    investedAmount: 35000,
    currentValue: 41850,
    returns: 6850,
    returnsPercentage: 19.57,
    apy: 16.8,
    status: "INVESTED",
    maturityDate: "2026-12-31",
    investmentDate: "2024-12-01",
    category: "Corporate",
    riskLevel: "Low",
  },
  {
    id: "3",
    poolName: "Dangote Commercial Paper",
    issuer: "Dangote Industries Limited",
    investedAmount: 15000,
    currentValue: 18750,
    returns: 3750,
    returnsPercentage: 25.0,
    apy: 21.5,
    status: "MATURED",
    maturityDate: "2025-01-30",
    investmentDate: "2024-08-15",
    category: "Commercial",
    riskLevel: "Medium",
  },
  {
    id: "4",
    poolName: "Access Bank Fixed Deposit",
    issuer: "Access Bank PLC",
    investedAmount: 12500,
    currentValue: 14500,
    returns: 2000,
    returnsPercentage: 16.0,
    apy: 14.5,
    status: "MATURED",
    maturityDate: "2024-12-15",
    investmentDate: "2023-12-15",
    category: "Banking",
    riskLevel: "Very Low",
  },
  {
    id: "5",
    poolName: "Zenith Bank Commercial Paper",
    issuer: "Zenith Bank PLC",
    investedAmount: 11000,
    currentValue: 13450,
    returns: 2450,
    returnsPercentage: 22.27,
    apy: 19.8,
    status: "FUNDING",
    maturityDate: "2025-05-15",
    investmentDate: "2025-02-15",
    category: "Banking",
    riskLevel: "Low",
  },
];

const recentTransactions = [
  {
    id: "1",
    type: "INVESTMENT",
    poolName: "Nigerian Treasury Bills",
    amount: 25000,
    date: "2025-03-01",
    status: "COMPLETED",
  },
  {
    id: "2",
    type: "RETURN",
    poolName: "Dangote Commercial Paper",
    amount: 18750,
    date: "2025-01-30",
    status: "COMPLETED",
  },
  {
    id: "3",
    type: "INVESTMENT",
    poolName: "MTN Group Corporate Bond",
    amount: 35000,
    date: "2024-12-01",
    status: "COMPLETED",
  },
  {
    id: "4",
    type: "RETURN",
    poolName: "Access Bank Fixed Deposit",
    amount: 14500,
    date: "2024-12-15",
    status: "COMPLETED",
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

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Very Low":
      return "text-emerald-400";
    case "Low":
      return "text-green-400";
    case "Medium":
      return "text-yellow-400";
    case "High":
      return "text-orange-400";
    case "Very High":
      return "text-red-400";
    default:
      return "text-slate-400";
  }
};

export default function PortfolioPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredHoldings = holdings.filter((holding) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active")
      return holding.status === "INVESTED" || holding.status === "FUNDING";
    if (selectedFilter === "matured") return holding.status === "MATURED";
    return true;
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "holdings", label: "Holdings" },
    { id: "transactions", label: "Transactions" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Portfolio</h1>
            <p className="text-lg text-slate-400">
              Track your investments and performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-400/80" />
              </div>
              <div className="flex items-center space-x-1 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +{portfolioData.returnsPercentage}%
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(portfolioData.totalValue)}
            </div>
            <div className="text-sm text-slate-400">Total Portfolio Value</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400/80" />
              </div>
              <div className="text-slate-400 text-sm">Principal</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(portfolioData.totalInvested)}
            </div>
            <div className="text-sm text-slate-400">Total Invested</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400/80" />
              </div>
              <div className="flex items-center space-x-1 text-purple-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +
                  {(
                    (portfolioData.totalReturns / portfolioData.totalInvested) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(portfolioData.totalReturns)}
            </div>
            <div className="text-sm text-slate-400">Total Returns</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400/80" />
              </div>
              <div className="text-slate-400 text-sm">Pending</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(portfolioData.pendingReturns)}
            </div>
            <div className="text-sm text-slate-400">Pending Returns</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === tab.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="space-y-8">
          {/* Portfolio Allocation */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Portfolio Allocation
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  By Category
                </h3>
                <div className="space-y-4">
                  {["Government", "Corporate", "Commercial", "Banking"].map(
                    (category) => {
                      const categoryHoldings = holdings.filter(
                        (h) => h.category === category
                      );
                      const categoryValue = categoryHoldings.reduce(
                        (sum, h) => sum + h.currentValue,
                        0
                      );
                      const percentage =
                        (categoryValue / portfolioData.totalValue) * 100;

                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <span className="text-slate-300">{category}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-200 font-semibold">
                              {formatCurrency(categoryValue)}
                            </div>
                            <div className="text-sm text-slate-400">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  By Status
                </h3>
                <div className="space-y-4">
                  {["INVESTED", "MATURED", "FUNDING"].map((status) => {
                    const statusHoldings = holdings.filter(
                      (h) => h.status === status
                    );
                    const statusValue = statusHoldings.reduce(
                      (sum, h) => sum + h.currentValue,
                      0
                    );
                    const percentage =
                      (statusValue / portfolioData.totalValue) * 100;

                    return (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                          <span className="text-slate-300">{status}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-200 font-semibold">
                            {formatCurrency(statusValue)}
                          </div>
                          <div className="text-sm text-slate-400">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Performance Metrics
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {(
                    (portfolioData.totalReturns / portfolioData.totalInvested) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-slate-400">Average Return</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {portfolioData.activeInvestments}
                </div>
                <div className="text-slate-400">Active Investments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {portfolioData.maturedInvestments}
                </div>
                <div className="text-slate-400">Completed Investments</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "holdings" && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none"
              >
                <option value="all">All Holdings</option>
                <option value="active">Active</option>
                <option value="matured">Matured</option>
              </select>
            </div>
            <div className="text-slate-400">
              {filteredHoldings.length} of {holdings.length} holdings
            </div>
          </div>

          {/* Holdings List */}
          <div className="space-y-4">
            {filteredHoldings.map((holding) => {
              const StatusIcon = getStatusIcon(holding.status);

              return (
                <div
                  key={holding.id}
                  className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6 hover:border-slate-600/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-100">
                          {holding.poolName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(holding.status)}`}
                        >
                          {holding.status}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-1">{holding.issuer}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{holding.category}</span>
                        <span>•</span>
                        <span className={getRiskColor(holding.riskLevel)}>
                          {holding.riskLevel} Risk
                        </span>
                        <span>•</span>
                        <span>{holding.apy}% APY</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-100 mb-1">
                        {formatCurrency(holding.currentValue)}
                      </div>
                      <div
                        className={`text-sm font-medium ${holding.returns >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {holding.returns >= 0 ? "+" : ""}
                        {formatCurrency(holding.returns)} (
                        {holding.returnsPercentage >= 0 ? "+" : ""}
                        {holding.returnsPercentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">
                        Invested
                      </div>
                      <div className="text-lg font-semibold text-slate-200">
                        {formatCurrency(holding.investedAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">
                        Investment Date
                      </div>
                      <div className="text-lg font-semibold text-slate-200">
                        {new Date(holding.investmentDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">
                        Maturity Date
                      </div>
                      <div className="text-lg font-semibold text-slate-200">
                        {new Date(holding.maturityDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href={`/pools/${holding.id}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-500/90 hover:to-pink-500/90 text-white font-medium rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedTab === "transactions" && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600/20"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "INVESTMENT"
                          ? "bg-blue-500/20"
                          : "bg-emerald-500/20"
                      }`}
                    >
                      {transaction.type === "INVESTMENT" ? (
                        <ArrowDownRight
                          className={`w-5 h-5 ${
                            transaction.type === "INVESTMENT"
                              ? "text-blue-400"
                              : "text-emerald-400"
                          }`}
                        />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        {transaction.type === "INVESTMENT"
                          ? "Investment"
                          : "Return"}
                      </div>
                      <div className="text-sm text-slate-400">
                        {transaction.poolName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-lg ${
                        transaction.type === "INVESTMENT"
                          ? "text-blue-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {transaction.type === "INVESTMENT" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-slate-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
