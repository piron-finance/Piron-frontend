"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { PoolCard } from "@/components/pools/pool-card";
import {
  Pool,
  PoolStatus,
  InstrumentType,
  RiskLevel,
  ApprovalStatus,
  Transaction,
  TransactionType,
  TransactionStatus,
} from "@/types";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateTime,
  getPoolStatusColor,
  getPoolStatusLabel,
} from "@/lib/utils";

const mockOverviewData = {
  totalInvested: "98750",
  currentValue: "125420",
  totalReturns: "26670",
  pendingInvestments: "15000",
  activePools: 3,
  maturedPools: 2,
  avgAPY: 14.2,
  totalPools: 12,
};

const mockFeaturedPools: Pool[] = [
  {
    _id: "1",
    contractAddress: "0x1234567890123456789012345678901234567890",
    managerAddress: "0x2345678901234567890123456789012345678901",
    escrowAddress: "0x3456789012345678901234567890123456789012",
    name: "US Treasury Bills Q4 2024",
    symbol: "USTB-Q4",
    asset: "USDC",
    instrumentType: InstrumentType.DISCOUNTED,
    status: PoolStatus.FUNDING,
    targetRaise: "5000000",
    totalRaised: "4250000",
    discountRate: 850,
    epochEndTime: Date.now() + 518400000,
    maturityDate: Date.now() + 7776000000,
    issuer: "US Treasury",
    riskLevel: RiskLevel.LOW,
    minInvestment: "1000",
    description: "Short-term government securities with guaranteed returns.",
    createdBy: "admin1",
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    createdAt: Date.now() - 2592000000,
    updatedAt: Date.now() - 86400000,
  },
  {
    _id: "2",
    contractAddress: "0x4567890123456789012345678901234567890123",
    managerAddress: "0x5678901234567890123456789012345678901234",
    escrowAddress: "0x6789012345678901234567890123456789012345",
    name: "Corporate Bonds Series A",
    symbol: "CORP-A",
    asset: "USDC",
    instrumentType: InstrumentType.INTEREST_BEARING,
    status: PoolStatus.FUNDING,
    targetRaise: "15000000",
    totalRaised: "8200000",
    couponRates: [400, 400, 400, 400],
    couponDates: [
      Date.now() + 7776000000,
      Date.now() + 15552000000,
      Date.now() + 23328000000,
      Date.now() + 31104000000,
    ],
    epochEndTime: Date.now() + 1296000000,
    maturityDate: Date.now() + 31104000000,
    issuer: "Fortune 500 Corporation",
    riskLevel: RiskLevel.MEDIUM,
    minInvestment: "5000",
    description: "24-month corporate bond with quarterly coupon payments.",
    createdBy: "admin1",
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    createdAt: Date.now() - 5184000000,
    updatedAt: Date.now() - 172800000,
  },
];

const mockRecentTransactions: Transaction[] = [
  {
    _id: "tx1",
    userId: "user1",
    poolId: "1",
    type: TransactionType.DEPOSIT,
    amount: "25000",
    shares: "25000",
    txHash: "0xabcd1234...",
    blockNumber: 12345678,
    status: TransactionStatus.CONFIRMED,
    createdAt: Date.now() - 3600000,
  },
  {
    _id: "tx2",
    userId: "user1",
    poolId: "2",
    type: TransactionType.COUPON_PAYMENT,
    amount: "1400",
    txHash: "0xefgh5678...",
    blockNumber: 12345677,
    status: TransactionStatus.CONFIRMED,
    createdAt: Date.now() - 7200000,
  },
  {
    _id: "tx3",
    userId: "user1",
    poolId: "3",
    type: TransactionType.WITHDRAW,
    amount: "18750",
    shares: "15000",
    txHash: "0xijkl9012...",
    blockNumber: 12345676,
    status: TransactionStatus.CONFIRMED,
    createdAt: Date.now() - 86400000,
  },
];

const mockAlerts = [
  {
    id: "1",
    type: "maturity",
    title: "Pool Maturity Approaching",
    message: "Municipal Bonds 2024 matures in 7 days",
    priority: "medium",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "2",
    type: "coupon",
    title: "Coupon Payment Available",
    message: "Claim $1,400 from Corporate Bonds Series A",
    priority: "high",
    createdAt: Date.now() - 1800000,
  },
];

export default function OverviewPage() {
  const totalInvested = parseFloat(mockOverviewData.totalInvested);
  const currentValue = parseFloat(mockOverviewData.currentValue);
  const totalReturns = currentValue - totalInvested;
  const returnsPercentage =
    totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">
            Track your investments and discover new opportunities
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Link href="/pools">
            <Plus className="w-4 h-4 mr-2" />
            Explore Pools
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Invested
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(mockOverviewData.totalInvested)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Across {mockOverviewData.activePools} active pools
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Current Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(mockOverviewData.currentValue)}
            </div>
            <p className="text-xs text-green-400 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {formatPercentage(returnsPercentage)} total return
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Average APY
            </CardTitle>
            <Target className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatPercentage(mockOverviewData.avgAPY)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Expected annual yield</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Active Positions
            </CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {mockOverviewData.activePools}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {mockOverviewData.maturedPools} matured
            </p>
          </CardContent>
        </Card>
      </div>

      {mockAlerts.length > 0 && (
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Important Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    {alert.title}
                  </p>
                  <p className="text-xs text-slate-400">{alert.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      alert.priority === "high"
                        ? "bg-red-500/20 text-red-300 border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    }
                  >
                    {alert.priority}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Featured Pools</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/pools" className="text-slate-400 hover:text-white">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockFeaturedPools.map((pool) => (
              <div
                key={pool._id}
                className="p-4 bg-slate-800/50 rounded-lg border border-white/5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{pool.name}</h3>
                    <p className="text-sm text-slate-400">{pool.issuer}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getPoolStatusColor(pool.status)} text-xs`}
                  >
                    {getPoolStatusLabel(pool.status)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">APY</span>
                    <p className="font-semibold text-green-400">
                      {formatPercentage(
                        pool.instrumentType === InstrumentType.DISCOUNTED &&
                          pool.discountRate
                          ? pool.discountRate / 100
                          : pool.couponRates
                            ? pool.couponRates.reduce(
                                (sum, rate) => sum + rate,
                                0
                              ) / 100
                            : 0
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Min Investment</span>
                    <p className="font-semibold text-white">
                      {formatCurrency(pool.minInvestment)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">
                      {formatPercentage(
                        (parseFloat(pool.totalRaised) /
                          parseFloat(pool.targetRaise)) *
                          100
                      )}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (parseFloat(pool.totalRaised) /
                        parseFloat(pool.targetRaise)) *
                        100,
                      100
                    )}
                    className="h-2 bg-slate-800"
                  />
                </div>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Link href={`/pools/${pool._id}`}>View Details</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href="/dashboard/transactions"
                  className="text-slate-400 hover:text-white"
                >
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentTransactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === TransactionType.DEPOSIT
                        ? "bg-green-500/20 text-green-400"
                        : tx.type === TransactionType.WITHDRAW
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {tx.type === TransactionType.DEPOSIT ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : tx.type === TransactionType.WITHDRAW ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white capitalize">
                      {tx.type.toLowerCase().replace("_", " ")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(tx.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(tx.amount)}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      tx.status === TransactionStatus.CONFIRMED
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : tx.status === TransactionStatus.PENDING
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                    }
                  >
                    {tx.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
