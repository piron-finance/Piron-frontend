"use client";
import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import {
  useRegistryContract,
  useMultiplePoolContracts,
  useFactoryContract,
} from "@/hooks/useContracts";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { InstrumentType, PoolStatus } from "@/types";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Database,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const { isConnected, chain } = useAccount();
  const [refreshing, setRefreshing] = useState(false);

  const {
    activePools,
    allPools,
    isLoadingActivePools,
    refetch: refetchRegistry,
  } = useRegistryContract();
  const { isLoadingPoolCount, refetch: refetchFactory } = useFactoryContract();
  const { pools, isLoading: isLoadingPools } = useMultiplePoolContracts(
    (allPools as `0x${string}`[]) || []
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchRegistry(), refetchFactory()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  };

  const isLoading =
    isLoadingActivePools || isLoadingPools || isLoadingPoolCount;

  const totalTVL =
    pools?.reduce((sum, pool) => sum + parseFloat(pool.totalRaised), 0) || 0;

  const totalPools = allPools.length || 0;

  const activePoolsCount = activePools?.length || 0;

  const maturedPoolsCount =
    pools?.filter((pool) => pool.status === PoolStatus.MATURED).length || 0;
  const pendingPoolsCount =
    pools?.filter((pool) => pool.status === PoolStatus.PENDING_INVESTMENT)
      .length || 0;

  const averageAPY = pools?.length
    ? pools.reduce((sum, pool) => {
        const apy =
          pool.instrumentType === InstrumentType.DISCOUNTED && pool.discountRate
            ? pool.discountRate / 100
            : pool.couponRates
              ? pool.couponRates.reduce((sum, rate) => sum + rate, 0) / 100
              : 0;
        return sum + apy;
      }, 0) / pools.length
    : 0;

  // Get top performing pools
  const topPools =
    pools
      ?.sort((a, b) => parseFloat(b.totalRaised) - parseFloat(a.totalRaised))
      .slice(0, 3) || [];

  if (!isConnected) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-slate-400 text-center">
              Please connect your wallet to view admin dashboard data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-400">
            Protocol operations and performance
          </p>

          {chain && (
            <p className="text-sm text-slate-500 mt-1">
              Connected to {chain.name}
            </p>
          )}
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
          </div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-slate-400">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-white mb-1">
                {formatCurrency(totalTVL.toString())}
              </div>
              <div className="text-sm text-slate-400">Total Value Locked</div>
            </>
          )}
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400/80" />
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-slate-400">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-white mb-1">
                {totalPools}
              </div>
              <div className="text-sm text-slate-400">Total Pools</div>
            </>
          )}
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400/80" />
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-slate-400">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-white mb-1">
                {activePoolsCount}
              </div>
              <div className="text-sm text-slate-400">Active Pools</div>
            </>
          )}
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400/80" />
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-slate-400">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-white mb-1">
                {formatPercentage(averageAPY)}
              </div>
              <div className="text-sm text-slate-400">Average APY</div>
            </>
          )}
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
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      activePoolsCount
                    )}
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
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      pendingPoolsCount
                    )}
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
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      maturedPoolsCount
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-500/20 rounded-xl flex items-center justify-center">
                      <Database className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Total Pools
                      </div>
                      <div className="text-sm text-slate-400">
                        All pools created
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-400">
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      totalPools
                    )}
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

        {/* Network Status */}
        <div>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Network Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-600/20">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <div className="font-medium text-slate-200">
                      {chain?.name || "Network"}
                    </div>
                    <div className="text-sm text-slate-400">
                      Chain ID: {chain?.id || "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-400 font-medium">
                  Connected
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-600/20">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <div className="font-medium text-slate-200">
                      Factory Contract
                    </div>
                    <div className="text-sm text-slate-400">Pool Creation</div>
                  </div>
                </div>
                <div className="text-sm text-green-400 font-medium">Active</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-600/20">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <div className="font-medium text-slate-200">
                      Registry Contract
                    </div>
                    <div className="text-sm text-slate-400">Pool Registry</div>
                  </div>
                </div>
                <div className="text-sm text-green-400 font-medium">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        {/* Top Performing Pools */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Top Performing Pools
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              <span className="ml-2 text-slate-400">Loading pools...</span>
            </div>
          ) : topPools.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No pools created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topPools.map((pool, index) => (
                <div
                  key={pool._id}
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
                        By {pool.issuer}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-200">
                      {formatCurrency(pool.totalRaised)}
                    </div>
                    <div className="text-sm text-orange-400">
                      {pool.instrumentType === InstrumentType.DISCOUNTED &&
                      pool.discountRate
                        ? `${pool.discountRate}% Discount`
                        : pool.couponRates
                          ? `${pool.couponRates.reduce((sum, rate) => sum + rate, 0)}% APY`
                          : "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
