"use client";

import { useState, useMemo } from "react";
import { PoolCard } from "@/components/pools/pool-card";
import {
  PoolFiltersComponent,
  PoolFilters,
} from "@/components/pools/pool-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Plus,
  BarChart3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { PoolStatus, InstrumentType } from "@/types";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
  useRegistryContract,
  useMultiplePoolContracts,
  useFactoryContract,
} from "@/hooks/useContracts";
import { useAccount } from "wagmi";

const mockUserPositions = {
  "1": {
    sharesOwned: "2500",
    currentValue: "2500",
    expectedReturn: "2712.50",
  },
  "3": {
    sharesOwned: "5000",
    currentValue: "5000",
    expectedReturn: "5350.00",
  },
};

export default function PoolsPage() {
  const { isConnected } = useAccount();
  const [filters, setFilters] = useState<PoolFilters>({
    search: "",
    status: "all",
    instrumentType: "all",
    riskLevel: "all",
    minAPY: "",
    maxAPY: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  const {
    activePools,
    allPools,
    isLoadingActivePools,
    refetch: refetchRegistry,
  } = useRegistryContract();
  const {
    poolCount,
    isLoadingPoolCount,
    refetch: refetchFactory,
  } = useFactoryContract();

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

  const filteredPools = useMemo(() => {
    if (!pools) return [];

    return pools.filter((pool) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !pool.name.toLowerCase().includes(searchTerm) &&
          !pool.issuer.toLowerCase().includes(searchTerm) &&
          !pool.description?.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      if (filters.status !== "all" && pool.status !== Number(filters.status)) {
        return false;
      }

      if (
        filters.instrumentType !== "all" &&
        pool.instrumentType !== Number(filters.instrumentType)
      ) {
        return false;
      }

      if (filters.riskLevel !== "all" && pool.riskLevel !== filters.riskLevel) {
        return false;
      }

      const expectedAPY =
        pool.instrumentType === InstrumentType.DISCOUNTED && pool.discountRate
          ? pool.discountRate / 100
          : pool.couponRates
            ? pool.couponRates.reduce((sum, rate) => sum + rate, 0) / 100
            : 0;

      if (filters.minAPY && expectedAPY < parseFloat(filters.minAPY)) {
        return false;
      }

      if (filters.maxAPY && expectedAPY > parseFloat(filters.maxAPY)) {
        return false;
      }

      return true;
    });
  }, [pools, filters]);

  const totalTVL =
    pools?.reduce((sum, pool) => sum + parseFloat(pool.totalRaised), 0) || 0;

  const activePoolsCount =
    pools?.filter(
      (pool) =>
        pool.status === PoolStatus.FUNDING ||
        pool.status === PoolStatus.INVESTED
    ).length || 0;

  const totalPools = pools?.length || 0;

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

  const isLoading =
    isLoadingActivePools || isLoadingPools || isLoadingPoolCount;

  if (!isConnected) {
    return (
      <div className="p-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-slate-400 text-center mb-6">
              Please connect your wallet to view and interact with investment
              pools.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Investment Pools</h1>
          <p className="text-slate-400 mt-1">
            Discover and invest in tokenized money market securities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-white/20 hover:border-white/40"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Link href="/admin/pools/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Pool
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Value Locked
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-slate-400">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(totalTVL.toString())}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Across {totalPools} pools
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Active Pools
            </CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-slate-400">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  {activePoolsCount}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {totalPools - activePoolsCount} completed
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Average APY
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-slate-400">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  {formatPercentage(averageAPY)}
                </div>
                <p className="text-xs text-slate-400 mt-1">Expected returns</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Your Positions
            </CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Object.keys(mockUserPositions).length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Active investments</p>
          </CardContent>
        </Card>
      </div>

      <PoolFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        activePoolsCount={filteredPools.length}
        totalPoolsCount={totalPools}
      />

      {isLoading ? (
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Loading Pools...
            </h3>
            <p className="text-slate-400 text-center">
              Fetching pool data from the blockchain
            </p>
          </CardContent>
        </Card>
      ) : filteredPools.length === 0 ? (
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No pools found
            </h3>
            <p className="text-slate-400 text-center">
              {pools?.length === 0
                ? "No pools have been created yet."
                : "Try adjusting your filters or search criteria to find investment opportunities."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <PoolCard
              key={pool._id}
              pool={pool}
              userPosition={
                mockUserPositions[pool._id as keyof typeof mockUserPositions]
              }
              showInvestButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
