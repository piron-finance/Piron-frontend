"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Building2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
} from "lucide-react";

// Mock pool data for admin management
const mockPools = [
  {
    id: "1",
    name: "Nigerian Treasury Bills Q3 2025",
    symbol: "NTB-Q3-25",
    issuer: "Central Bank of Nigeria",
    status: "FUNDING",
    instrumentType: "DISCOUNTED",
    targetRaise: 5000000,
    totalRaised: 3750000,
    fundingProgress: 75,
    epochEndTime: "2025-04-15T23:59:59",
    maturityDate: "2025-09-15",
    discountRate: 24.2,
    minimumInvestment: 1000,
    totalInvestors: 847,
    riskLevel: "Very Low",
    category: "Government",
    createdAt: "2025-03-01T10:00:00",
    isActive: true,
  },
  {
    id: "2",
    name: "MTN Group Corporate Bond Series 4",
    symbol: "MTN-CB-S4",
    issuer: "MTN Group Limited",
    status: "INVESTED",
    instrumentType: "INTEREST_BEARING",
    targetRaise: 10000000,
    totalRaised: 10000000,
    fundingProgress: 100,
    epochEndTime: "2024-11-30T23:59:59",
    maturityDate: "2026-12-31",
    couponRate: 16.8,
    minimumInvestment: 5000,
    totalInvestors: 1234,
    riskLevel: "Low",
    category: "Corporate",
    createdAt: "2024-11-01T14:30:00",
    isActive: true,
  },
  {
    id: "3",
    name: "Dangote Commercial Paper 2025-A",
    symbol: "DCP-2025A",
    issuer: "Dangote Industries Limited",
    status: "MATURED",
    instrumentType: "DISCOUNTED",
    targetRaise: 7500000,
    totalRaised: 7500000,
    fundingProgress: 100,
    epochEndTime: "2024-08-15T23:59:59",
    maturityDate: "2025-01-30",
    discountRate: 21.5,
    minimumInvestment: 2500,
    totalInvestors: 567,
    riskLevel: "Medium",
    category: "Commercial",
    createdAt: "2024-07-15T09:15:00",
    isActive: true,
  },
  {
    id: "4",
    name: "Access Bank Fixed Deposit Premium",
    symbol: "ABP-FD-24",
    issuer: "Access Bank PLC",
    status: "EMERGENCY",
    instrumentType: "INTEREST_BEARING",
    targetRaise: 3000000,
    totalRaised: 1200000,
    fundingProgress: 40,
    epochEndTime: "2024-10-31T23:59:59",
    maturityDate: "2025-10-31",
    couponRate: 14.5,
    minimumInvestment: 1000,
    totalInvestors: 234,
    riskLevel: "Very Low",
    category: "Banking",
    createdAt: "2024-09-01T11:45:00",
    isActive: false,
  },
  {
    id: "5",
    name: "Zenith Bank Commercial Paper Q1",
    symbol: "ZB-CP-Q1",
    issuer: "Zenith Bank PLC",
    status: "PENDING_INVESTMENT",
    instrumentType: "DISCOUNTED",
    targetRaise: 4000000,
    totalRaised: 4000000,
    fundingProgress: 100,
    epochEndTime: "2025-02-28T23:59:59",
    maturityDate: "2025-05-15",
    discountRate: 19.8,
    minimumInvestment: 1500,
    totalInvestors: 456,
    riskLevel: "Low",
    category: "Banking",
    createdAt: "2025-01-15T16:20:00",
    isActive: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "FUNDING":
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    case "PENDING_INVESTMENT":
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
    case "INVESTED":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "MATURED":
      return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
    case "EMERGENCY":
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "FUNDING":
      return Clock;
    case "PENDING_INVESTMENT":
      return AlertCircle;
    case "INVESTED":
      return CheckCircle;
    case "MATURED":
      return Target;
    case "EMERGENCY":
      return AlertCircle;
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

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
};

export default function ManagePoolsPage() {
  const [pools, setPools] = useState(mockPools);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPools, setSelectedPools] = useState<string[]>([]);

  const filteredPools = pools.filter((pool) => {
    const matchesSearch =
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || pool.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || pool.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handlePoolAction = (poolId: string, action: string) => {
    console.log(`Performing ${action} on pool ${poolId}`);
    // Here you would implement the actual pool management actions
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk ${action} on pools:`, selectedPools);
    setSelectedPools([]);
  };

  const togglePoolSelection = (poolId: string) => {
    setSelectedPools((prev) =>
      prev.includes(poolId)
        ? prev.filter((id) => id !== poolId)
        : [...prev, poolId]
    );
  };

  const selectAllPools = () => {
    setSelectedPools(
      selectedPools.length === filteredPools.length
        ? []
        : filteredPools.map((pool) => pool.id)
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">Manage Pools</h1>
          <p className="text-lg text-slate-400">
            Monitor and manage all investment pools
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
          <Link
            href="/admin/pools/create"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600/90 to-orange-600/90 hover:from-red-500/90 hover:to-orange-500/90 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/15"
          >
            <Plus className="w-5 h-5" />
            <span>Create Pool</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400/80" />
            </div>
            <div className="text-slate-400 text-sm">Total</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {pools.length}
          </div>
          <div className="text-sm text-slate-400">Active Pools</div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400/80" />
            </div>
            <div className="text-slate-400 text-sm">TVL</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(
              pools.reduce((sum, pool) => sum + pool.totalRaised, 0)
            )}
          </div>
          <div className="text-sm text-slate-400">Total Value Locked</div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400/80" />
            </div>
            <div className="text-slate-400 text-sm">Users</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {pools
              .reduce((sum, pool) => sum + pool.totalInvestors, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Total Investors</div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400/80" />
            </div>
            <div className="text-slate-400 text-sm">Funding</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {pools.filter((p) => p.status === "FUNDING").length}
          </div>
          <div className="text-sm text-slate-400">Active Funding</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search pools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="FUNDING">Funding</option>
              <option value="PENDING_INVESTMENT">Pending Investment</option>
              <option value="INVESTED">Invested</option>
              <option value="MATURED">Matured</option>
              <option value="EMERGENCY">Emergency</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Government">Government</option>
              <option value="Corporate">Corporate</option>
              <option value="Commercial">Commercial</option>
              <option value="Banking">Banking</option>
            </select>
          </div>

          {selectedPools.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">
                {selectedPools.length} selected
              </span>
              <button
                onClick={() => handleBulkAction("pause")}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
              >
                Pause
              </button>
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                Activate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pools Table */}
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/40">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedPools.length === filteredPools.length &&
                      filteredPools.length > 0
                    }
                    onChange={selectAllPools}
                    className="rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
                  Pool
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
                  Raised
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
                  Investors
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
                  Maturity
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredPools.map((pool) => {
                const StatusIcon = getStatusIcon(pool.status);
                const isSelected = selectedPools.includes(pool.id);

                return (
                  <tr
                    key={pool.id}
                    className={`hover:bg-slate-700/20 transition-colors ${
                      isSelected ? "bg-slate-700/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePoolSelection(pool.id)}
                        className="rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-orange-400/80" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">
                            {pool.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {pool.issuer}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(pool.status)}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span>{pool.status.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-400">
                            {pool.fundingProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${pool.fundingProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-200">
                          {formatCurrency(pool.totalRaised)}
                        </div>
                        <div className="text-sm text-slate-400">
                          of {formatCurrency(pool.targetRaise)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">
                        {pool.totalInvestors.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-400">
                        {new Date(pool.maturityDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/pools/${pool.id}`}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handlePoolAction(pool.id, "edit")}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                          title="Edit Pool"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handlePoolAction(
                              pool.id,
                              pool.isActive ? "pause" : "activate"
                            )
                          }
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                          title={pool.isActive ? "Pause Pool" : "Activate Pool"}
                        >
                          {pool.isActive ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              No pools found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
